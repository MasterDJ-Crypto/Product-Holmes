import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import Header from './components/Header';
import Footer from './components/icons/Footer';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import WeeklyScanTimer from './components/WeeklyScanTimer';
import LoginScreen from './components/LoginScreen';
import OrganizationSetupWizard from './components/OrganizationSetupWizard';
import AdminSetupDashboard from './components/AdminSetupDashboard';
import ComparisonLayout from './components/ComparisonLayout';
import CompetitorControls from './components/CompetitorControls';
import SubscriptionPage from './components/SubscriptionPage';
import PaymentPage from './components/PaymentPage';
import LandingPage from './components/LandingPage';
import { analyzeProductFeedback } from './services/feedbackAnalyzerService';
import { Issue, ProductInstanceData, AppStorage, FilterState, AppView } from './types';
import ProductInstanceMenu from './components/ProductInstanceMenu'; 
import { DocumentMagnifyingGlassIcon } from './components/icons/DocumentMagnifyingGlassIcon';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// NOTE TO DEVELOPER: 
// You MUST go to WorkOS Dashboard -> Authentication -> Settings 
// and DISABLE "Allow Self-Service Signups". 
// This ensures the /login route rejects anyone who hasn't been explicitly invited or provisioned via SSO.

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const APP_STORAGE_KEY = 'productHolmes_appStorage';
const AUTH_KEY = 'productHolmes_isAuthenticated'; 
const AUTH_PROVIDER_KEY = 'productHolmes_authProvider'; // 'workos' | 'demo'
const SELECTED_PLAN_KEY = 'productHolmes_selectedPlan';
const PAYMENT_COMPLETED_KEY = 'productHolmes_paymentCompleted';
const FREE_TIER_SCANS_COUNT_KEY = 'productHolmes_freeTierScansCount';
const FREE_TIER_LAST_RESET_KEY = 'productHolmes_freeTierLastReset';
const IS_NEW_ADMIN_KEY = 'productHolmes_isNewAdmin'; // Track if user just created the workspace

const sortIssuesByOccurrences = (issues: Issue[]): Issue[] => {
  return [...issues].sort((a, b) => (b.totalOccurrences || 0) - (a.totalOccurrences || 0));
};

const generateNewInstanceId = () => `inst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const createNewProductInstance = (id?: string, name: string = ''): ProductInstanceData => ({
  id: id || generateNewInstanceId(),
  productName: name, 
  issues: [],
  isLoading: false,
  error: null,
  hasSearched: false,
  lastScanTimestamp: null,
  nextScanDue: null,
  competitorProductName: null,
  competitorIssues: [],
  isCompetitorLoading: false,
  competitorError: null,
});

interface AnalysisQueueItem {
  instanceId: string;
  name: string;
  isCompetitor: boolean;
  planForAnalysis: string | null;
}

const initialFilterState: FilterState = {
  keyword: '',
  category: null,
  sourceType: null,
  startDate: null,
  endDate: null,
};

const App: React.FC = () => {
  // --- WorkOS Auth Hook ---
  const { user, isLoading: isAuthLoading, signOut, getAccessToken } = useAuth();

  // --- Theme Management ---
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
        const storedTheme = localStorage.getItem('productHolmes_theme');
        if (storedTheme) {
            return (storedTheme === 'dark') ? 'dark' : 'light';
        }
        return 'light'; 
    } catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('productHolmes_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // --- Auth State Derivation (WorkOS + Demo Legacy) ---
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState<boolean>(() => {
    try { return localStorage.getItem(AUTH_KEY) === 'true'; } 
    catch (e) { return false; }
  });

  const isAuthenticated = !!user || isDemoAuthenticated;

  // --- View Routing Logic (B2B Architecture) ---
  const getInitialView = (): AppView => {
    if (!isAuthenticated) return 'landing';

    // If authenticated, check if they are in the middle of Admin Setup
    const isNewAdmin = localStorage.getItem(IS_NEW_ADMIN_KEY) === 'true';
    if (isNewAdmin) return 'admin_setup';

    const plan = localStorage.getItem(SELECTED_PLAN_KEY);
    const paymentCompleted = localStorage.getItem(PAYMENT_COMPLETED_KEY) === 'true';

    // If they are a normal user (or finished setup) but haven't paid/selected plan (Legacy Flow support)
    if (!plan) return 'subscription';
    if (!paymentCompleted) return 'payment';
    
    return 'app';
  };
  
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  
  // Effect to handle view transitions when auth state settles
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        // "Traffic Cop" Logic
        if (['landing', 'login', 'create_workspace'].includes(currentView)) {
           const isNewAdmin = localStorage.getItem(IS_NEW_ADMIN_KEY) === 'true';
           
           if (isNewAdmin) {
             setCurrentView('admin_setup');
           } else {
             // Standard Employee / Legacy Flow
             const plan = localStorage.getItem(SELECTED_PLAN_KEY);
             const paymentCompleted = localStorage.getItem(PAYMENT_COMPLETED_KEY) === 'true';
             
             if (!plan) setCurrentView('subscription');
             else if (!paymentCompleted) setCurrentView('payment');
             else setCurrentView('app');
           }
        }
      } else {
        // If not authenticated and seemingly inside private routes, kick to landing
        if (['subscription', 'payment', 'app', 'admin_setup'].includes(currentView)) {
           setCurrentView('landing');
        }
      }
    }
  }, [isAuthenticated, isAuthLoading, currentView]);


  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    try { return localStorage.getItem(SELECTED_PLAN_KEY); } 
    catch (e) { return null; }
  });

  const [productInstances, setProductInstances] = useState<Map<string, ProductInstanceData>>(new Map());
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);
  const [draftInstanceData, setDraftInstanceData] = useState<ProductInstanceData | null>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [analysisQueue, setAnalysisQueue] = useState<AnalysisQueueItem | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [freeTierScansThisMonth, setFreeTierScansThisMonth] = useState<number>(0);
  const [lastFreeTierScanReset, setLastFreeTierScanReset] = useState<number | null>(null);

  // Load App Data from Storage
  useEffect(() => {
    if (currentView === 'app') {
      try {
        const storedAppDataString = localStorage.getItem(APP_STORAGE_KEY);
        if (storedAppDataString) {
          const storedAppData: AppStorage = JSON.parse(storedAppDataString);
          const loadedInstances = new Map<string, ProductInstanceData>();
          if (storedAppData.productInstances) {
            Object.entries(storedAppData.productInstances).forEach(([id, data]) => {
              const currentPlanFromStorage = localStorage.getItem(SELECTED_PLAN_KEY) || 'free'; 
              const scanInterval = currentPlanFromStorage === 'free' ? ONE_MONTH_MS : ONE_WEEK_MS;
              loadedInstances.set(id, {
                ...data,
                issues: sortIssuesByOccurrences(data.issues || []),
                competitorIssues: sortIssuesByOccurrences(data.competitorIssues || []),
                nextScanDue: (currentPlanFromStorage !== 'free' && data.lastScanTimestamp) ? data.lastScanTimestamp + scanInterval : null,
              });
            });
          }

          if (loadedInstances.size > 0) {
            setProductInstances(loadedInstances);
            const lastActiveId = storedAppData.activeInstanceId; 
            if (lastActiveId && loadedInstances.has(lastActiveId)) {
              setActiveInstanceId(lastActiveId);
              setDraftInstanceData(null); 
            } else if (loadedInstances.size > 0) { 
              setActiveInstanceId(loadedInstances.keys().next().value);
              setDraftInstanceData(null);
            } else { 
                 const defaultDraft = createNewProductInstance(undefined, ""); 
                 setDraftInstanceData(defaultDraft);
                 setActiveInstanceId(null);
            }
          } else { 
            const defaultDraft = createNewProductInstance(undefined, ""); 
            setDraftInstanceData(defaultDraft);
            setActiveInstanceId(null); 
          }
        } else { 
          const defaultDraft = createNewProductInstance(undefined, "");
          setDraftInstanceData(defaultDraft);
          setActiveInstanceId(null); 
        }

        const storedScansCount = localStorage.getItem(FREE_TIER_SCANS_COUNT_KEY);
        const storedLastReset = localStorage.getItem(FREE_TIER_LAST_RESET_KEY);
        setFreeTierScansThisMonth(storedScansCount ? parseInt(storedScansCount, 10) : 0);
        setLastFreeTierScanReset(storedLastReset ? parseInt(storedLastReset, 10) : null);

      } catch (e) {
        console.error("Failed to load app data from localStorage:", e);
        const defaultDraft = createNewProductInstance(undefined, "");
        setDraftInstanceData(defaultDraft);
        setActiveInstanceId(null); 
      }
    }
  }, [currentView]); 

  // Save App Data to Storage
  useEffect(() => {
    if (currentView === 'app') {
      try {
        const instancesObject: { [id: string]: ProductInstanceData } = {};
        productInstances.forEach((instance, id) => {
          instancesObject[id] = instance;
        });
        const appDataToStore: AppStorage = {
          productInstances: instancesObject,
          activeInstanceId: activeInstanceId, 
        };
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appDataToStore));
        localStorage.setItem(FREE_TIER_SCANS_COUNT_KEY, freeTierScansThisMonth.toString());
        if (lastFreeTierScanReset) {
          localStorage.setItem(FREE_TIER_LAST_RESET_KEY, lastFreeTierScanReset.toString());
        } else {
          localStorage.removeItem(FREE_TIER_LAST_RESET_KEY);
        }

      } catch (e) {
        console.error("Failed to save app data to localStorage:", e);
      }
    }
  }, [productInstances, activeInstanceId, currentView, freeTierScansThisMonth, lastFreeTierScanReset]);
  
  const activeProductInstance: ProductInstanceData | null | undefined = 
    activeInstanceId 
      ? productInstances.get(activeInstanceId) 
      : draftInstanceData;

  const updateInstanceData = useCallback((instanceId: string, updates: Partial<ProductInstanceData>) => {
    setProductInstances(prev => {
      const newInstances = new Map<string, ProductInstanceData>(prev);
      const currentInstance = newInstances.get(instanceId);
      if (currentInstance) {
        const updatedInstance = { ...currentInstance, ...updates };
        if (updates.issues) {
          updatedInstance.issues = sortIssuesByOccurrences(updates.issues);
        }
        if (updates.competitorIssues) {
          updatedInstance.competitorIssues = sortIssuesByOccurrences(updates.competitorIssues);
        }
        if ('lastScanTimestamp' in updates && updates.lastScanTimestamp !== currentInstance.lastScanTimestamp) {
            const currentPlanForUpdate = selectedPlan || (localStorage.getItem(SELECTED_PLAN_KEY) || 'free'); 
          if (currentPlanForUpdate !== 'free' && updates.lastScanTimestamp) {
            const scanInterval = ONE_WEEK_MS; 
            updatedInstance.nextScanDue = updates.lastScanTimestamp + scanInterval;
          } else {
            updatedInstance.nextScanDue = null; 
          }
        }
        newInstances.set(instanceId, updatedInstance);
        return newInstances;
      }
      return prev;
    });
  }, [selectedPlan]); 
  
  const performAnalysis = useCallback(async (instanceIdToAnalyze: string, name: string, isCompetitorLoad: boolean = false, planForThisAnalysis: string | null) => {
    const instanceForAnalysis = productInstances.get(instanceIdToAnalyze);
    if (!instanceForAnalysis) {
       if (!activeInstanceId && draftInstanceData) { 
        setDraftInstanceData(prevDraft => prevDraft ? {...prevDraft, error: "Failed to initialize analysis. Instance context lost.", isLoading: false} : null);
      } else if (activeInstanceId === instanceIdToAnalyze) {
         updateInstanceData(instanceIdToAnalyze, 
            isCompetitorLoad 
            ? { competitorError: "Analysis failed: Instance context error.", isCompetitorLoading: false } 
            : { error: "Analysis failed: Instance context error.", isLoading: false }
        );
      }
      return;
    }
    
    updateInstanceData(instanceIdToAnalyze, 
      isCompetitorLoad 
        ? { isCompetitorLoading: true, competitorError: null, competitorProductName: name } 
        : { isLoading: true, error: null, hasSearched: true, productName: name, competitorProductName: null, competitorIssues: [], competitorError: null, isCompetitorLoading: false }
    );
    
    try {
      const fetchedIssues = await analyzeProductFeedback(name, planForThisAnalysis);
      const newScanTimestamp = Date.now();
      if (isCompetitorLoad) {
        updateInstanceData(instanceIdToAnalyze, {
          competitorIssues: fetchedIssues,
          isCompetitorLoading: false,
        });
      } else {
        updateInstanceData(instanceIdToAnalyze, {
          issues: fetchedIssues,
          lastScanTimestamp: newScanTimestamp, 
          isLoading: false,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || (isCompetitorLoad ? 'Failed to analyze competitor product.' : 'Failed to analyze product.');
      if (isCompetitorLoad) {
        updateInstanceData(instanceIdToAnalyze, { competitorError: errorMessage, isCompetitorLoading: false });
      } else {
        updateInstanceData(instanceIdToAnalyze, { 
          error: errorMessage, 
          isLoading: false, 
          issues: [], 
          lastScanTimestamp: null 
        });
      }
    }
  }, [productInstances, updateInstanceData, activeInstanceId, draftInstanceData]);

  useEffect(() => {
    if (analysisQueue) {
      const { instanceId, name, isCompetitor, planForAnalysis } = analysisQueue;
      
      if (productInstances.has(instanceId) && activeInstanceId === instanceId) {
        performAnalysis(instanceId, name, isCompetitor, planForAnalysis);
        setAnalysisQueue(null); 
      } else if (!productInstances.has(instanceId) && draftInstanceData && draftInstanceData.id === instanceId) {
        const registeredInstance = productInstances.get(activeInstanceId || "");
        if (registeredInstance && registeredInstance.id === instanceId) {
          performAnalysis(instanceId, name, isCompetitor, planForAnalysis);
          setAnalysisQueue(null);
        }
      }
    }
  }, [analysisQueue, productInstances, activeInstanceId, performAnalysis, draftInstanceData]);


  const handleAnalyze = useCallback((searchName: string) => {
    if (!searchName.trim()) return;
    const trimmedSearchName = searchName.trim();
    setFilters(initialFilterState); 

    const currentPlanForAnalysis = selectedPlan || localStorage.getItem(SELECTED_PLAN_KEY) || 'free';
    const isFreeTier = currentPlanForAnalysis === 'free';
    let proceedWithAnalysis = true;
    let newAnalysisSession = false;

    if (isFreeTier) {
      if (!activeInstanceId || (productInstances.get(activeInstanceId!)?.productName !== trimmedSearchName)) {
        newAnalysisSession = true;
      }
    }
    
    if (isFreeTier && newAnalysisSession) {
      const now = Date.now();
      let currentScans = freeTierScansThisMonth;
      let currentResetTimestamp = lastFreeTierScanReset;

      if (!currentResetTimestamp || (now - currentResetTimestamp > ONE_MONTH_MS)) {
        currentScans = 0;
        currentResetTimestamp = now;
        setLastFreeTierScanReset(now); 
      }

      if (currentScans >= 1) { 
        const nextAvailableGlobalDate = new Date((currentResetTimestamp || now) + ONE_MONTH_MS);
        const globalErrorMessage = `Free tier limit reached. Next new investigation available on ${nextAvailableGlobalDate.toLocaleDateString()}.`;
        if (activeInstanceId && productInstances.has(activeInstanceId)) {
          updateInstanceData(activeInstanceId, { error: globalErrorMessage, isLoading: false });
        } else if (draftInstanceData) {
          setDraftInstanceData(prevDraft => prevDraft ? { ...prevDraft, error: globalErrorMessage, isLoading: false } : null);
        }
        proceedWithAnalysis = false;
      }
    }

    if (proceedWithAnalysis && isFreeTier && activeInstanceId) {
        const instanceToCheck = productInstances.get(activeInstanceId);
        if (instanceToCheck && instanceToCheck.productName === trimmedSearchName && instanceToCheck.lastScanTimestamp) {
            const timeSinceLastScan = Date.now() - instanceToCheck.lastScanTimestamp;
            if (timeSinceLastScan < ONE_MONTH_MS) {
                const nextAvailableDate = new Date(instanceToCheck.lastScanTimestamp + ONE_MONTH_MS);
                const errorMessage = `Free tier limit. Next analysis available on ${nextAvailableDate.toLocaleDateString()}.`;
                updateInstanceData(activeInstanceId, { error: errorMessage, isLoading: false });
                proceedWithAnalysis = false; 
            }
        }
    }
    
    if (!proceedWithAnalysis) return;

    if (activeInstanceId && productInstances.has(activeInstanceId)) {
        const currentInstance = productInstances.get(activeInstanceId)!;
        if (currentInstance.error) updateInstanceData(activeInstanceId, { error: null });
    } else if (draftInstanceData && draftInstanceData.error) {
        setDraftInstanceData(prevDraft => prevDraft ? { ...prevDraft, error: null } : null);
    }


    if (!activeInstanceId && draftInstanceData) { 
      const instanceToRegister: ProductInstanceData = { 
        ...draftInstanceData, 
        productName: trimmedSearchName, 
        hasSearched: true, 
        isLoading: true, 
        error: null, 
      };
      
      setProductInstances(prev => new Map(prev).set(instanceToRegister.id, instanceToRegister));
      setActiveInstanceId(instanceToRegister.id);
      setDraftInstanceData(null); 
      setAnalysisQueue({ instanceId: instanceToRegister.id, name: trimmedSearchName, isCompetitor: false, planForAnalysis: currentPlanForAnalysis });
      if (isFreeTier && newAnalysisSession) { 
        setFreeTierScansThisMonth(prev => prev + 1);
        if (!lastFreeTierScanReset) setLastFreeTierScanReset(Date.now());
      }

    } else if (activeInstanceId && productInstances.has(activeInstanceId)) { 
      const currentInstance = productInstances.get(activeInstanceId)!;
      if (currentInstance.productName !== trimmedSearchName) {
         updateInstanceData(activeInstanceId, { productName: trimmedSearchName, issues: [], competitorProductName: null, competitorIssues: [], lastScanTimestamp: null, nextScanDue: null, error: null, competitorError: null });
         if (isFreeTier && newAnalysisSession) {
            setFreeTierScansThisMonth(prev => prev + 1);
            if (!lastFreeTierScanReset) setLastFreeTierScanReset(Date.now());
         }
      }
      setAnalysisQueue({ instanceId: activeInstanceId, name: trimmedSearchName, isCompetitor: false, planForAnalysis: currentPlanForAnalysis });
    }
  }, [activeInstanceId, draftInstanceData, productInstances, updateInstanceData, selectedPlan, freeTierScansThisMonth, lastFreeTierScanReset]);

  const handleAnalyzeCompetitor = useCallback((competitorName: string) => {
    if (!competitorName.trim()) return;
    const currentPlanForAnalysis = selectedPlan || localStorage.getItem(SELECTED_PLAN_KEY) || 'free';
    if (currentPlanForAnalysis !== 'max') {
        alert("Competitor analysis is a Max Tier feature."); 
        return;
    }

    const trimmedCompetitorName = competitorName.trim();
    
    if (activeInstanceId && productInstances.has(activeInstanceId)) {
      setAnalysisQueue({ instanceId: activeInstanceId, name: trimmedCompetitorName, isCompetitor: true, planForAnalysis: currentPlanForAnalysis });
    }
  }, [activeInstanceId, productInstances, draftInstanceData, selectedPlan, updateInstanceData]);
  
  const handleResolveIssue = useCallback((issueId: string) => {
    if (!activeInstanceId || !productInstances.has(activeInstanceId)) return;
    const currentInstance = productInstances.get(activeInstanceId)!;
    const updatedIssues = currentInstance.issues.filter(issue => issue.id !== issueId);
    updateInstanceData(activeInstanceId, { issues: updatedIssues });
  }, [activeInstanceId, productInstances, updateInstanceData]);
  
  const handleResolveCompetitorIssue = useCallback((issueId: string) => {
    if (!activeInstanceId || !productInstances.has(activeInstanceId)) return;
     const currentInstance = productInstances.get(activeInstanceId)!;
    if (currentInstance) {
      const updatedIssues = currentInstance.competitorIssues.filter(issue => issue.id !== issueId);
      updateInstanceData(activeInstanceId, { competitorIssues: updatedIssues });
    }
  }, [activeInstanceId, productInstances, updateInstanceData]);

  const handleClearCompetitor = useCallback(() => {
    if (activeInstanceId && productInstances.has(activeInstanceId)) {
      updateInstanceData(activeInstanceId, {
        competitorProductName: null,
        competitorIssues: [],
        competitorError: null,
        isCompetitorLoading: false,
      });
    }
  }, [activeInstanceId, updateInstanceData]);

  const handleAddNewInstance = useCallback(() => {
    const newDraft = createNewProductInstance(undefined, ""); 
    setDraftInstanceData(newDraft);
    setActiveInstanceId(null); 
    setShowProductMenu(false); 
    setFilters(initialFilterState); 
  }, []);

  const handleSelectInstance = useCallback((instanceId: string) => {
    if (productInstances.has(instanceId)) {
      setActiveInstanceId(instanceId);
      setDraftInstanceData(null); 
      setShowProductMenu(false); 
      setFilters(initialFilterState); 
    }
  }, [productInstances]);

  const handleDeleteInstance = useCallback((instanceIdToDelete: string) => {
    if (!window.confirm("Delete this investigation?")) {
        return;
    }

    setProductInstances(prev => {
        const newInstances = new Map(prev);
        newInstances.delete(instanceIdToDelete);
        
        if (activeInstanceId === instanceIdToDelete) { 
            if (newInstances.size > 0) {
                setActiveInstanceId(newInstances.keys().next().value); 
                setDraftInstanceData(null); 
            } else { 
                const newDraft = createNewProductInstance(undefined, "");
                setDraftInstanceData(newDraft);
                setActiveInstanceId(null); 
            }
             setFilters(initialFilterState);
        }
        return newInstances;
    });
    setShowProductMenu(false);
  }, [activeInstanceId]);


  const handleResetActiveInstance = useCallback(() => { 
    if (activeInstanceId && productInstances.has(activeInstanceId)) { 
      const current = productInstances.get(activeInstanceId)!;
      if (window.confirm(`Reset investigation for "${current.productName || 'this product'}"?`)){
        const resetInstanceData = createNewProductInstance(activeInstanceId, ""); 
        updateInstanceData(activeInstanceId, resetInstanceData);
        setFilters(initialFilterState); 
      }
    } else if (!activeInstanceId && draftInstanceData) { 
        setDraftInstanceData(createNewProductInstance(undefined, "")); 
        setFilters(initialFilterState);
    }
    setShowProductMenu(false);
  }, [activeInstanceId, draftInstanceData, productInstances, updateInstanceData]);
  
  const handleToggleProductMenu = useCallback(() => {
    setShowProductMenu(prev => !prev);
  }, []);

  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  // --- Auth Handlers ---
  const handleLoginSuccess = useCallback(() => {
    // This is called by legacy/demo login
    setIsDemoAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_PROVIDER_KEY, 'demo');
    
    // Check flow state
    const plan = localStorage.getItem(SELECTED_PLAN_KEY);
    const paymentCompleted = localStorage.getItem(PAYMENT_COMPLETED_KEY) === 'true';
    setSelectedPlan(plan);

    if (plan && paymentCompleted) setCurrentView('app');
    else if (plan) setCurrentView('payment'); 
    else setCurrentView('subscription');
  }, []);

  const handleLogout = useCallback(async () => {
    // Determine provider to cleanup correctly
    const provider = localStorage.getItem(AUTH_PROVIDER_KEY);
    
    if (provider === 'demo') {
      setIsDemoAuthenticated(false);
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_PROVIDER_KEY);
    } else {
      // WorkOS SignOut
      await signOut(); 
    }
    localStorage.removeItem(IS_NEW_ADMIN_KEY); // Clear admin session flag
    
    // Clear view state
    setCurrentView('landing'); 
    setShowProductMenu(false);
  }, [signOut]);

  const handleSelectPlan = useCallback((planName: string) => {
    setSelectedPlan(planName);
    try { 
        localStorage.setItem(SELECTED_PLAN_KEY, planName); 
        localStorage.removeItem(PAYMENT_COMPLETED_KEY); 
        if (planName !== 'free') {
          localStorage.removeItem(FREE_TIER_SCANS_COUNT_KEY);
          localStorage.removeItem(FREE_TIER_LAST_RESET_KEY);
          setFreeTierScansThisMonth(0);
          setLastFreeTierScanReset(null);
        }
    } 
    catch (e) { console.warn(e); }
    setCurrentView('payment');
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    try { localStorage.setItem(PAYMENT_COMPLETED_KEY, 'true'); } 
    catch (e) { console.warn(e); }
    
    const currentPlanFromStorage = localStorage.getItem(SELECTED_PLAN_KEY);
    setSelectedPlan(currentPlanFromStorage);

    setProductInstances(prevInstances => {
        const newInstances = new Map<string, ProductInstanceData>(prevInstances);
        newInstances.forEach((instance, id) => {
            const scanInterval = (currentPlanFromStorage || 'free') === 'free' ? ONE_MONTH_MS : ONE_WEEK_MS;
            const updatedInstance = {
                ...instance,
                nextScanDue: (currentPlanFromStorage !== 'free' && instance.lastScanTimestamp) 
                                ? instance.lastScanTimestamp + scanInterval 
                                : null,
            };
            newInstances.set(id, updatedInstance);
        });
        return newInstances;
    });
    
    setCurrentView('app');
  }, []);

  const handleGoToSubscription = useCallback(() => { setCurrentView('subscription'); }, []);
  const handleNavigateToCreateWorkspace = useCallback(() => { setCurrentView('create_workspace'); }, []);
  const handleNavigateToLogin = useCallback(() => { setCurrentView('login'); }, []);
  const handleAdminSetupComplete = useCallback(() => {
     localStorage.removeItem(IS_NEW_ADMIN_KEY);
     setCurrentView('subscription'); 
  }, []);


  const handleTestToken = async () => {
    try {
        const token = await getAccessToken();
        console.log("Access Token:", token);
        alert("Access Token retrieved! Check console.");
    } catch (e) {
        console.error("Failed to get access token", e);
        alert("Failed to get token. Are you logged in via WorkOS?");
    }
  };

  useEffect(() => {
    if (currentView === 'app' && isAuthenticated) { 
        setProductInstances(prevInstances => {
            const newInstances = new Map<string, ProductInstanceData>(prevInstances);
            let changed = false;
            newInstances.forEach((instance, id) => {
                const scanInterval = (selectedPlan || 'free') === 'free' ? ONE_MONTH_MS : ONE_WEEK_MS;
                const newNextScanDue = (selectedPlan !== 'free' && instance.lastScanTimestamp)
                                       ? instance.lastScanTimestamp + scanInterval
                                       : null;
                if (instance.nextScanDue !== newNextScanDue) {
                    newInstances.set(id, { ...instance, nextScanDue: newNextScanDue });
                    changed = true;
                }
            });
            return changed ? newInstances : prevInstances;
        });
    }
  }, [selectedPlan, currentView, isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="w-full h-screen bg-[var(--bg-body)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (currentView === 'landing') return (
    <div key="landing" className="w-full h-full animate-page-enter">
      <LandingPage onNavigateToLogin={handleNavigateToLogin} onNavigateToSignUp={handleNavigateToCreateWorkspace} />
    </div>
  );
  if (currentView === 'login') return (
    <div key="login" className="w-full h-full animate-page-enter">
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
    </div>
  );
  if (currentView === 'create_workspace') return (
    <div key="create_workspace" className="w-full h-full animate-page-enter">
        <OrganizationSetupWizard onNavigateToLogin={handleNavigateToLogin} />
    </div>
  );
  if (currentView === 'admin_setup') return (
      <div key="admin_setup" className="w-full h-full animate-page-enter">
          <AdminSetupDashboard onComplete={handleAdminSetupComplete} />
      </div>
  )
  if (currentView === 'subscription') return (
    <div key="subscription" className="w-full h-full animate-page-enter">
      <SubscriptionPage currentPlan={selectedPlan} onSelectPlan={handleSelectPlan} />
    </div>
  );
  if (currentView === 'payment') return (
    <div key="payment" className="w-full h-full animate-page-enter">
      <PaymentPage selectedPlan={selectedPlan} onPaymentSuccess={handlePaymentSuccess} />
    </div>
  );
  
  return (
    <div key="app" className="flex flex-col min-h-screen animate-page-enter">
      <Header 
        onGoHome={handleResetActiveInstance}
        currentView={currentView}
        selectedPlan={selectedPlan}
        onGoToSubscription={handleGoToSubscription}
        onLogout={handleLogout}
        onToggleProductMenu={handleToggleProductMenu}
        onAddNewInstance={handleAddNewInstance}
        activeProductName={activeProductInstance?.productName || "New Investigation"}
        isProductMenuOpen={showProductMenu}
        toggleTheme={toggleTheme}
        currentTheme={theme}
      />
      <ProductInstanceMenu
        isOpen={showProductMenu}
        instances={Array.from(productInstances.values())} 
        activeInstanceId={activeInstanceId} 
        onSelectInstance={handleSelectInstance}
        onDeleteInstance={handleDeleteInstance}
        onClose={() => setShowProductMenu(false)}
      />
      <main 
        key={activeProductInstance?.id || 'draft_view'} 
        className="flex-grow container mx-auto px-4 pt-20 pb-8 animate-page-enter"
      >
        {!activeProductInstance && currentView === 'app' ? ( 
          <div className="flex flex-col items-center justify-center h-full">
            <LoadingSpinner />
            <p className="mt-4 text-gray-500 font-medium">Initializing Analyst...</p>
          </div>
        ) : activeProductInstance ? ( 
          <>
            <SearchBar 
                onAnalyze={handleAnalyze} 
                isLoading={activeProductInstance.isLoading}
                initialProductName={activeProductInstance.productName} 
            />
            
            {activeProductInstance.error && (
              <div 
                className="liquid-glass mb-6 border-l-4 border-red-500 animate-list-enter"
                role="alert"
              >
                <h3 className="text-lg font-semibold mb-1 text-red-500">Attention</h3>
                <p className="text-gray-400">
                  {activeProductInstance.error}
                </p>
              </div>
            )}

            {activeProductInstance.hasSearched && !activeProductInstance.isLoading && !activeProductInstance.error && activeInstanceId && (
              <div className="space-y-4 animate-list-enter" style={{ animationDelay: '100ms' }}>
                {activeProductInstance.productName && (!activeProductInstance.competitorProductName || selectedPlan !== 'max') && (
                  <ResultsDisplay 
                    issues={activeProductInstance.issues} 
                    productName={activeProductInstance.productName} 
                    onResolveIssue={handleResolveIssue}
                    selectedPlan={selectedPlan}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    onGoToSubscription={handleGoToSubscription}
                  />
                )}
                
                <CompetitorControls 
                  key={`comp-${activeProductInstance.id}`} 
                  currentCompetitorName={activeProductInstance.competitorProductName}
                  onAnalyze={handleAnalyzeCompetitor}
                  onClear={handleClearCompetitor}
                  isLoading={activeProductInstance.isCompetitorLoading}
                  disabled={!activeInstanceId || !activeProductInstance.hasSearched}
                  selectedPlan={selectedPlan}
                  onGoToSubscription={handleGoToSubscription}
                />

                {selectedPlan === 'max' && activeProductInstance.competitorProductName && (
                  <ComparisonLayout
                    primaryProduct={{
                      name: activeProductInstance.productName || "Primary Product",
                      issues: activeProductInstance.issues,
                      onResolve: handleResolveIssue,
                      isLoading: activeProductInstance.isLoading,
                      error: activeProductInstance.error,
                      selectedPlan: selectedPlan,
                      onGoToSubscription: handleGoToSubscription
                    }}
                    competitorProduct={{
                      name: activeProductInstance.competitorProductName,
                      issues: activeProductInstance.competitorIssues,
                      onResolve: handleResolveCompetitorIssue,
                      isLoading: activeProductInstance.isCompetitorLoading,
                      error: activeProductInstance.competitorError,
                      selectedPlan: selectedPlan,
                      onGoToSubscription: handleGoToSubscription
                    }}
                  />
                )}
                 {selectedPlan !== 'max' && activeProductInstance.competitorProductName && (
                     <div className="liquid-glass text-center p-6 animate-list-enter">
                        <h3 className="text-lg font-semibold text-white mb-2">Upgrade Required</h3>
                        <p className="text-gray-400">Competitor data for "{activeProductInstance.competitorProductName}" is hidden.</p>
                        <button
                            onClick={handleGoToSubscription}
                            className="mt-4 px-6 py-2 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors apple-click"
                        >
                            Upgrade to Max
                        </button>
                    </div>
                 )}
              </div>
            )}
            
            {activeProductInstance.isLoading && <LoadingSpinner />}
            
            {activeInstanceId && activeProductInstance.productName && activeProductInstance.hasSearched && !activeProductInstance.isLoading && !activeProductInstance.error && (
              <div className="mt-8 text-center animate-list-enter" style={{ animationDelay: '300ms' }}>
                <WeeklyScanTimer 
                  productName={activeProductInstance.productName} 
                  nextScanTimestamp={activeProductInstance.nextScanDue}
                  isScanning={false} 
                  selectedPlan={selectedPlan}
                  onGoToSubscription={handleGoToSubscription}
                />
              </div>
            )}
            {!activeInstanceId && draftInstanceData && !draftInstanceData.hasSearched && !draftInstanceData.isLoading && (
                 <div className="liquid-glass text-center py-16 px-4 animate-list-enter">
                    <DocumentMagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-500 mb-6" />
                    <h2 className="text-2xl font-semibold text-white mb-3">Ready to Analyze</h2>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Enter a product name above to generate a comprehensive report.
                    </p>
                 </div>
            )}
          </>
        ) : (
          <div className="liquid-glass text-center py-16 px-4 animate-list-enter">
            <DocumentMagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-500 mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">Start Investigation</h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Select an existing report or start a new analysis.
            </p>
          </div>
        )}
      </main>
      <Footer>
        <button onClick={handleTestToken} className="text-[10px] text-gray-600 hover:text-gray-400">
             API Connection Test (Auth Only)
        </button>
      </Footer>
    </div>
  );
};

export default App;