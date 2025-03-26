// src/components/FinancialData.js
import React, { useState,useRef ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../service/client';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Chart from "chart.js/auto";
import DOMPurify from "dompurify";
 import Header from './Header';
 import Footer from './Footer';
import { ClipLoader } from "react-spinners";
 
import {
  Bar,
  Pie,
} from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
 
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
 
 
 
 
 
const Home = () => {
 
 
  // downloading loaders
 
  const [isDownloading, setIsDownloading] = useState(false);
 
  const [activeTab, setActiveTab] = useState(0);
  const [cashSavings, setCashSavings] = useState("");
  const [ownsRealEstate, setOwnsRealEstate] = useState(false);
  const [numProperties, setNumProperties] = useState("");
  const [primaryResidenceValue, setPrimaryResidenceValue] = useState("");
  const [ownsInvestmentProperties, setOwnsInvestmentProperties] = useState(false);
  const [hasInvestments, setHasInvestments] = useState(false);
  const [investmentsValue, setInvestmentsValue] = useState("");
  const [hasValuableAssets, setHasValuableAssets] = useState(false);
  const [valuableAssetsValue, setValuableAssetsValue] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [receivesRentalIncome, setReceivesRentalIncome] = useState(false);
  const [monthlyRentalIncome, setMonthlyRentalIncome] = useState("");
  const [monthlyFixedExpenses, setMonthlyFixedExpenses] = useState("");
  const [monthlyVariableExpenses, setMonthlyVariableExpenses] = useState("");
  const [emergencyFund, setEmergencyFund] = useState("");
  const [emergencyFundCoverageMonths, setEmergencyFundCoverageMonths] = useState("");
  const [hasSavingsGoals, setHasSavingsGoals] = useState(false);
  const [savingsGoal1Description, setSavingsGoal1Description] = useState("");
  const [savingsGoal1Amount, setSavingsGoal1Amount] = useState("");
  const [monthlySavingsContribution, setMonthlySavingsContribution] = useState("");
  const [plansToBuyProperty, setPlansToBuyProperty] = useState(false);
  const [investsInFinancialAssets, setInvestsInFinancialAssets] = useState(false);
  const [investmentAllocationPercentage, setInvestmentAllocationPercentage] = useState("");
  const [investmentRiskComfort, setInvestmentRiskComfort] = useState("");
  const [hasMortgage, setHasMortgage] = useState(false);
  const [mortgageBalance, setMortgageBalance] = useState("");
  const [monthlyMortgagePayment, setMonthlyMortgagePayment] = useState("");
  const [mortgageInterestRate, setMortgageInterestRate] = useState("");
  const [mortgageYearsLeft, setMortgageYearsLeft] = useState("");
  const [hasOtherDebts, setHasOtherDebts] = useState(false);
  const [otherDebtBalance, setOtherDebtBalance] = useState("");
  const [monthlyDebtRepayment, setMonthlyDebtRepayment] = useState("");
  const [monthlyDebtRepaymentTotal, setMonthlyDebtRepaymentTotal] = useState("");
  const [plansToPayOffMortgageEarly, setPlansToPayOffMortgageEarly] = useState(false);
  const [hasWorkplacePension, setHasWorkplacePension] = useState(false);
  const [pensionBalance, setPensionBalance] = useState("");
  const [employerMatchesPension, setEmployerMatchesPension] = useState(false);
  const [monthlyPensionContribution, setMonthlyPensionContribution] = useState("");
  const [hasPrivatePension, setHasPrivatePension] = useState(false);
  const [plansToUsePropertyEquity, setPlansToUsePropertyEquity] = useState(false);
  const [plannedRetirementAge, setPlannedRetirementAge] = useState("");
  const [usesTaxEfficientAccounts, setUsesTaxEfficientAccounts] = useState(false);
  const [maxedIsaAllowance, setMaxedIsaAllowance] = useState(false);
  const [tracksCapitalGains, setTracksCapitalGains] = useState(false);
  const [donatesToCharity, setDonatesToCharity] = useState(false);
  const [charityDonationAmount, setCharityDonationAmount] = useState("");
  const [needsInvestmentHelp, setNeedsInvestmentHelp] = useState(false);
  const [usesFinancialTools, setUsesFinancialTools] = useState(false);
  const [financialTools, setFinancialTools] = useState("");
  const [wantsPersonalizedPlan, setWantsPersonalizedPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryError, setQueryError] = useState("");
  const [insights, setInsights] = useState(null);
  const [mortgageYearsLeftError, setMortgageYearsLeftError] = useState("");
  const [plannedRetirementAgeError, setPlannedRetirementAgeError] = useState("");
  const [id,setId] = useState(null);
  // query states
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isResultVisible, setIsResultVisible] = useState(false);
  // Query Design
  const [htmlDesign, setHtmlDesign] = useState("");
  const chartRef = useRef(null);
  const showTab = (index) => {
    setActiveTab(index);
  };
  const reportRef = useRef();
 
  const validateYears = (value, setError) => {
    const years = parseInt(value, 10);
    if (value && (isNaN(years) || years >= 100)) {
      setError("Please enter a value less than 100 years.");
      return false;
    }
    setError("");
    return true;
  };
 
  const downloadReport = () => {
    setIsDownloading(true);
    const input = reportRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
 
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
 
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
 
      pdf.save("Financial_Insights_Report.pdf");
        setIsDownloading(false);
    });
 
  };
 
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);
 
   
    const formData = {
      cash_savings: parseFloat(cashSavings) || 0,
      owns_real_estate: ownsRealEstate,
      num_properties: parseInt(numProperties) || 0,
      primary_residence_value: parseFloat(primaryResidenceValue) || 0,
      owns_investment_properties: ownsInvestmentProperties,
      has_investments: hasInvestments,
      investments_value: parseFloat(investmentsValue) || 0,
      has_valuable_assets: hasValuableAssets,
      valuable_assets_value: parseFloat(valuableAssetsValue) || 0,
      has_mortgage: hasMortgage,
      mortgage_balance: parseFloat(mortgageBalance) || 0,
      monthly_mortgage_payment: parseFloat(monthlyMortgagePayment) || 0,
      mortgage_interest_rate: parseFloat(mortgageInterestRate) || 0,
      mortgage_years_left: parseInt(mortgageYearsLeft) || 0,
      has_other_debts: hasOtherDebts,
      // other_debt_balance: parseFloat(otherDebtBalance) || 0,
      monthly_debt_repayment: parseFloat(monthlyDebtRepayment) || 0,
      monthly_income: parseFloat(monthlyIncome) || 0,
      receives_rental_income: receivesRentalIncome,
      monthly_rental_income: parseFloat(monthlyRentalIncome) || 0,
      monthly_fixed_expenses: parseFloat(monthlyFixedExpenses) || 0,
      monthly_variable_expenses: parseFloat(monthlyVariableExpenses) || 0,
      emergency_fund: parseFloat(emergencyFund) || 0,
      emergency_fund_coverage_months: parseInt(emergencyFundCoverageMonths) || 0,
      has_savings_goals: hasSavingsGoals,
      savings_goal_1_description: savingsGoal1Description,
      savings_goal_1_amount: parseFloat(savingsGoal1Amount) || 0,
      monthly_savings_contribution: parseFloat(monthlySavingsContribution) || 0,
      plans_to_buy_property: plansToBuyProperty,
      invests_in_financial_assets: investsInFinancialAssets,
      investment_allocation_percentage: parseFloat(investmentAllocationPercentage) || 0,
      investment_risk_comfort: investmentRiskComfort,
      // monthly_debt_repayment_total: parseFloat(monthlyDebtRepaymentTotal) || 0,
      plans_to_pay_off_mortgage_early: plansToPayOffMortgageEarly,
      has_workplace_pension: hasWorkplacePension,
      pension_balance: parseFloat(pensionBalance) || 0,
      monthly_pension_contribution: parseFloat(monthlyPensionContribution) || 0,
      employer_matches_pension: employerMatchesPension,
      has_private_pension: hasPrivatePension,
      planned_retirement_age: parseInt(plannedRetirementAge) || 0,
      plans_to_use_property_equity: plansToUsePropertyEquity,
      uses_tax_efficient_accounts: usesTaxEfficientAccounts,
      maxed_isa_allowance: maxedIsaAllowance,
      tracks_capital_gains: tracksCapitalGains,
      donates_to_charity: donatesToCharity,
      // charity_donation_amount: parseFloat(charityDonationAmount) || 0,
      needs_investment_help: needsInvestmentHelp,
      uses_financial_tools: usesFinancialTools,
      financial_tools: financialTools,
      wants_personalized_plan: wantsPersonalizedPlan,
 
 
    };
 
    try {
     
      const response = await apiPost("api/generate", formData);
 
      if (response?.data?.status === true) {
        setInsights(response?.data?.data);
        setId(response?.data?.id);
        setActiveTab(8);
      }
 
     
    } catch (err) {
      setError("Failed to submit the form or generate insights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
 
 
 
  const handleSubmitQuery = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setQueryError("");
    setHtmlDesign("");
    // Get the query input value
    const queryInput = query.trim();
    if (!queryInput) {
      setQueryError("Please enter a financial query.");
      return;
    }
 
    if (!id) {
      setQueryError("Please fill the form first.");
      return;
    }
    setIsResultVisible(true);
    setKeyword(queryInput);
    setQueryError("");
    try {
      const response = await apiPost("api/aiinsights", {"id":id,"prompt": queryInput});
      if (response?.data?.status === true) {
        if (response?.data?.data?.insights?.html_design) {
          setHtmlDesign(response?.data?.data?.insights?.html_design);
          console.log("response---------->",response?.data?.data?.insights?.html_design);
        }else {
          setHtmlDesign(response?.data?.data?.html_design);
          console.log("response---------->",response?.data?.data?.html_design);
        }
        // setInsights(response?.data?.data);
        // setHtmlDesign(response?.data?.data?.insights?.html_design);
        // console.log("response---------->",response?.data?.data?.insights?.html_design);
        setIsResultVisible(true);
      }
    } catch (err) {
      setQueryError("Failed to proceed with the query. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
 
  const getBodyContent = (htmlString) => {
    const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : htmlString;
  };
 
  useEffect(() => {
    if (htmlDesign && isResultVisible) {
      // Extract the script content
      const scriptMatch = htmlDesign.match(
        /<script>([\s\S]*?)<\/script>/
      );
      if (scriptMatch && scriptMatch[1]) {
        try {
          // Create a function from the script content
          const scriptContent = scriptMatch[1].replace("window.onload = function ()", "return function ()");
          const scriptFunction = new Function(scriptContent)();
          scriptFunction();
        } catch (e) {
          console.error("Error executing chart script:", e);
          const chartError = document.getElementById("chart-error");
          if (chartError) {
            chartError.style.display = "block";
          }
        }
      }
    }
  }, [htmlDesign, isResultVisible]);
 
 
 
  const colors = {
    blue: "#36A2EB",
    red: "#FF6384",
    green: "#4BC0C0",
    yellow: "#FFCE56",
    purple: "#9966FF",
    orange: "#FF9F40",
    cyan: "#17A2B8",
    pink: "#E83E8C",
  };
 
 
 
 
 
  const retirementOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Retirement Overview (£)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (£)",
        },
      },
    },
  };
 
 
 
 
  const retirementData = {
    labels: ["Pension Balance", "Monthly Contribution"],
    datasets: [
      {
        label: "Amount (£)",
        data: [
          insights?.retirement?.pension_balance ?? 0,
          insights?.retirement?.monthly_pension_contribution ?? 0,
        ],
        backgroundColor: [colors.blue, colors.red],
      },
    ],
  };
 
 
 
  const investmentsSavingsOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Investments & Savings Breakdown (£)",
      },
    },
  };
 
 
 
  const debtOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Debt Overview (£)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (£)",
        },
      },
    },
  };
 
 
  const debtData = {
    labels: ["Mortgage Balance", "Monthly Payment"],
    datasets: [
      {
        label: "Amount (£)",
        data: [insights?.debt?.mortgage_balance ?? 0, insights?.debt?.monthly_mortgage_payment ?? 0],
        backgroundColor: [colors.blue, colors.red],
      },
    ],
  };
 
 
 
  const cashFlowIncomeOptions = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Income vs. Net Cash Flow (£)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (£)",
        },
      },
    },
  };
 
 
  const cashFlowIncomeData = {
    labels: ["Monthly Income", "Net Cash Flow"],
    datasets: [
      {
        label: "Amount (£)",
        data: [insights?.cash_flow?.income ?? 0, insights?.cash_flow?.net ?? 0],
        backgroundColor: [colors.blue, colors.green],
      },
    ],
  };
 
 
  const cashFlowExpensesOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Expenses Breakdown (£)",
      },
    },
  };
 
 
  const cashFlowExpensesData = {
    labels: ["Mortgage Payment", "Fixed Expenses", "Variable Expenses", "Savings Contribution", "Pension Contribution"],
    datasets: [
      {
        data: [
          insights?.cash_flow?.expenses?.monthly_mortgage_payment ?? 0,
          insights?.cash_flow?.expenses?.monthly_fixed_expenses ?? 0,
          insights?.cash_flow?.expenses?.monthly_variable_expenses ?? 0,
          insights?.cash_flow?.expenses?.monthly_savings_contribution ?? 0,
          insights?.cash_flow?.expenses?.monthly_pension_contribution ?? 0,
        ],
        backgroundColor: [colors.blue, colors.red, colors.green, colors.yellow, colors.purple],
      },
    ],
  };
 
 
  const netWorthOptions = {
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Net Worth Breakdown (£)",
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Amount (£)",
        },
      },
      y: {
        stacked: true,
      },
    },
  };
 
 
  const netWorthData = {
    labels: ["Net Worth"],
    datasets: [
      {
        label: "Cash Savings",
        data: [insights?.net_worth?.assets?.cash_savings ?? 0],
        backgroundColor: colors.blue,
      },
      {
        label: "Primary Residence",
        data: [insights?.net_worth?.assets?.primary_residence_value ?? 0],
        backgroundColor: colors.red,
      },
      {
        label: "Investments",
        data: [insights?.net_worth?.assets?.investments_value ?? 0],
        backgroundColor: colors.green,
      },
      {
        label: "Pension Balance",
        data: [insights?.net_worth?.assets?.pension_balance ?? 0],
        backgroundColor: colors.yellow,
      },
      {
        label: "Mortgage",
        data: [-(insights?.net_worth?.liabilities?.mortgage_balance ?? 0)],
        backgroundColor: colors.purple,
      },
      {
        label: "Credit Card",
        data: [-(insights?.net_worth?.liabilities?.credit_card_balance ?? 0)],
        backgroundColor: colors.orange,
      },
      {
        label: "Personal Loan",
        data: [-(insights?.net_worth?.liabilities?.personal_loan_balance ?? 0)],
        backgroundColor: colors.cyan,
      },
    ],
  };
 
 
 
 
 
 
 
  const investmentsSavingsData = {
    labels: ["Cash Savings", "Investments Value"],
    datasets: [
      {
        data: [
          insights?.investments_savings?.cash_savings ?? 0,
          insights?.investments_savings?.investments_value ?? 0,
        ],
        backgroundColor: [colors.blue, colors.red],
      },
    ],
  };
 
 




  return (
    <>

      {/* HEADER SECTION START */}
      <Header></Header>
      {/* HEADER SECTION ENDS HERE */}


      {/* BANNER SECTION START */}
      <section className="banner">
        <div className="container main-contaier">
          <div className="row">
            <div className="col-lg-6  d-flex flex-column  justify-content-center">
              <div className="banner-content">
                <h1>
                  <span>Build</span> Wealth Confidently with Trusted{" "}
                  <span>Financial</span> Guidance
                </h1>
                <p>
                  Take control of your wealth with personalized strategies, smart
                  investments, and expert advice tailored to your goals. Let's build
                  your financial freedom—starting today.
                </p>
                <button className="btn-start">Get Started</button>
              </div>
            </div>
            <div className="col-lg-6 d-flex banner-res">
              <div className="banner-image">
                <img src="./images/financial-banner.png" alt="Banner Image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BANNER SECTION ENDS HERE */}


      {/* ADIVSORY SECTION START */}
      <div className="container padd-sectoin">
        <section className="advisory-section">
          <div className="advisory-image">
            <img
              src="./images/financial-abou-section-1.png"
              alt="Financial Advisory"
            />
          </div>
          <div className="advisory-content">
            <h2>
              Expert Financial <br />
              Advisory for a Secure <br />
              Future
            </h2>
            <p>
              Get personalized financial guidance to grow your wealth, manage risks,
              and achieve your financial goals with confidence. Let our expert
              advisors help you make smart investment and savings decisions.
            </p>
          </div>
        </section>
      </div>
      {/* ADIVSORY SECTION ENDS HERE */}


    {/* FEATURES SECTION START  */}
      <div className="container padd-section">
        <div className="row">
          <div className="col-lg-6 home-content">
            <h2>
              Smarter Money Guidance, <span>Powered by AI</span>
            </h2>
            <p>
              Take control of your finances with clear, unbiased, and intelligent guidance. The guidance is AI-generated using publicly available data and not based on your personal circumstances.  Our AI assistant helps you explore budgeting tools, investment platforms, and financial services — all in one place.
            </p>
            <p>
              Explore AI-powered suggestions and tips to help you plan your finances. Our AI assistant offers accessible, UK-focused guidance — from budgeting and saving to investing and building long-term financial confidence.
            </p>

            <div class="cta-section">
              <button class="cta-button primary">Explore your options</button>
              <button class="cta-button secondary">Chat with our AI</button>
              <button class="cta-button secondary">Get ideas to move forward</button>
              <p class="disclaimer"><i class="fas fa-exclamation-triangle"></i> General guidance only — not financial advice.</p>
            </div>
          </div>
          <div className="col-lg-6">
            
    <div class="content-section">
        <ul class="features-list">
            <li>
                <i class="fas fa-wallet"></i>
                <span><strong>Your AI-Powered Money Mentor</strong> Smarter suggestions to manage, grow, and plan your finances — with no jargon, no pressure, and no personal advice.</span>
            </li>
            <li>
                <i class="fas fa-lightbulb"></i>
                <span><strong>Financial Clarity Starts Here</strong> Use our AI to explore ideas, tools, and tips that could help you build confidence and improve your financial health.</span>
            </li>
            <li>
                <i class="fas fa-rocket"></i>
                <span><strong>Get Unstuck with Your Money</strong> Ask our AI questions and get ideas to move forward — whether you’re saving, budgeting, or planning for the future.</span>
            </li>
            <li>
                <i class="fas fa-heart"></i>
                <span><strong>Friendly, Fuss-Free Financial Guidance</strong> Explore your options, understand your money, and get inspired to take your next step — all powered by AI.</span>
            </li>
            <li>
                <i class="fas fa-brain"></i>
                <span><strong>A New Way to Think About Money</strong> Our AI helps you explore what’s possible without judgment or complexity.</span>
            </li>
        </ul>
    </div>
          </div>
        </div>
        <div className="row">
        <div className="col-lg-12 pt-4 pb-4">
          <div className="btn-section">
            <a href="#" className='cta-button secondary'>Learn How It Works</a>
            <a href="#" className='cta-button secondary'>Try the AI Tool </a>
          </div>
        </div>
        </div>
      </div>
      {/* FEATURES SECTION ENDS HERE */}


      {/* CHECKPOINTS SECTION START	 */}
      <div className="container py-5">
        <div className="row mb-4 align-items-center">
          <div className="col-md-7 section-header">
            <h2>
              Actionable Insights for <br />
              Better Financial Health
            </h2>
          </div>
          <div className="col-md-5 text-md-end">
            <p>
              Gain data-driven insights and expert strategies to improve your
              financial well-being, optimize investments, and secure long-term
              stability.
            </p>
            <button className="see-details-btn mt-3">See Details</button>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/first-icon.png" alt="Budget Insights" />
              </div>
              <h5>Budget Insights</h5>
              <p>
                Minimal expense tracking and 0% savings rate highlight the need for
                income generation and better budgeting practices. No overspending is
                observed, but financial sustainability is at risk without income.
              </p>
              <div className="arrow-icon">→</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card insight-card-blue">
              <div className="icon-box">
                <img src="./images/second-icon.png" alt="Debt Managements" />
              </div>
              <h5>Debt Management</h5>
              <p>
                No current debts, resulting in a 0% debt-to-income ratio. While this
                indicates no liabilities, it also suggests financial vulnerability.
                Building an emergency fund is recommended for future stability.
              </p>
              <div className="arrow-icon">→</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/third-icon.png" alt="Investment Guidance" />
              </div>
              <h5>Investment Guidance</h5>
              <p>
                No investments recorded, indicating missed opportunities. User is
                advised to start with low-risk savings and gradually diversify into
                investment options based on medium risk comfort.
              </p>
              <div className="arrow-icon">→</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/fourth-icon.png" alt="Financial Health Score" />
              </div>
              <h5>Financial Health Score</h5>
              <p>
                Overall score is 20/100, primarily due to lack of income, savings,
                and investments. The only positive factor is the absence of debt,
                but financial planning is critically lacking.
              </p>
              <div className="arrow-icon">→</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card insight-card-blue">
              <div className="icon-box">
                <img src="./images/fiveth-icon.png" alt="Custom Recommendations" />
              </div>
              <h5>Custom Recommendations</h5>
              <p>
                Focus on generating income, optimizing savings through high-interest
                and tax-efficient accounts, and planning for future expenses and
                retirement contributions to build long-term financial stability.
              </p>
              <div className="arrow-icon">→</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/6th-icon.png" alt="Retirement Planning" />
              </div>
              <h5>Retirement Planning</h5>
              <p>
                No savings or pension contributions are in place, making future
                retirement planning currently ineffective. It’s essential to
                initiate contributions as soon as income starts, ensuring a secure
                and stable financial future.
              </p>
              <div className="arrow-icon">→</div>
            </div>
          </div>
        </div>
      </div>
      {/* CHECKPOINTS SECTION ENDS HERE */}

    {/* About section start */}
      <div className="container pt-5 pb-5" id='About-Main'>
        <div className="row">
          <div className="col-lg-6 about-content">
            <h2>
            Who We Are  
            </h2>
            <p>
            We’re on a mission to make personal finance more accessible, less overwhelming, and a little smarter. 
            </p>
            <p>
            Our platform uses AI to help you explore UK financial products — from budgeting apps and savings accounts to credit cards and investment tools. 
            </p>
            <p>
            We're not a bank, adviser, or lender. We're a digital guide built to help you navigate modern money choices, powered by intelligent tech. 
            </p>
            <p>
            We do not give personalised advice. What we do offer is smart, accessible information to help you make informed choices. 
            </p>

           <div className="btn-know">
           <a href="#" className='cta-button secondary'>Know More</a>
           </div>
          </div>
          <div className="col-lg-6 d-flex justify-content-end ">
              <img src='./images/about-finance-2.png' alt='' className='img-border'/>
          </div>
        </div>
      </div>
    {/* About section ends here */}

      {/* FAQ SECTION START */}
      <div className="container faq-section">
        <h2 className="my-h2">
          Everything You Need to
          <br />
          Know Before You Start
        </h2>
        <div className="accordion" id="faqAccordion">
  {[
    {
      id: "One",
      question: "Is this financial advice?",
      answer:
        "No — the tool provides general guidance only. It helps you explore your options based on public information and common financial tools in the UK. It’s not tailored advice and doesn’t replace professional, regulated financial advice.",
    },
    {
      id: "Two",
      question: "Is the AI tool safe to use?",
      answer:
        "Yes — the tool doesn’t collect or store any personal financial data. Everything is anonymous, and no accounts or logins are required.",
    },
    {
      id: "Three",
      question: "How does the tool know what to suggest?",
      answer:
        "Our AI uses patterns from publicly available financial information, UK consumer data, and guidance from trusted sources to generate useful suggestions based on the inputs you provide.",
    },
    {
      id: "Four",
      question: "What kind of questions can I ask?",
      answer:
        "You can ask about budgeting, saving, investing, debt management, financial goals, and more. The AI will guide you with ideas and common tools used by UK consumers.",
    },
    {
      id: "Five",
      question: "Are the product links affiliate links?",
      answer:
        "Sometimes — we may receive a commission if you click a link and sign up for a product. However, this doesn’t affect how we present options. We aim to offer clear, unbiased comparisons.",
    },
    {
      id: "Six",
      question: "Do I need to sign up or create an account?",
      answer: "Nope — it’s totally free to use. Just start asking questions.",
    },
    {
      id: "Seven",
      question: "Can I rely on the information?",
      answer:
        "The AI provides general guidance, not financial advice. You should always do your own research or speak with an FCA-regulated adviser before making any decisions.",
    },
  ].map(({ id, question, answer }, index) => (
    <div className="accordion-item" key={id}>
      <h2 className="accordion-header" id={`heading${id}`}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${id}`}
          aria-expanded="false"
          aria-controls={`collapse${id}`}
        >
          <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
          <span>{question}</span>
        </button>
      </h2>
      <div
        id={`collapse${id}`}
        className="accordion-collapse collapse"
        aria-labelledby={`heading${id}`}
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  ))}
</div>



        <div className="col-lg-12 mt-5 mb-5">
          <h3 className='my-font'><i class="fa-solid fa-circle-question"></i> Chatbot-Specific Questions </h3>
        </div>

      <div className="accordion" id="faqAccordion">
  {[
    {
      id: "Ten",
      question: "How do I start using the chatbot?",
      answer:
        "Simply click ‘X' on our homepage. You don’t need to register or create an account — just type your question and the chatbot will respond.",
      expanded: true, // First accordion item should be open
    },
    {
      id: "Eleven",
      question: "What kind of inputs does the chatbot need from me?",
      answer:
        "The chatbot may ask simple, non-identifying questions about your financial habits or goals (like saving, budgeting, or investing) to offer more relevant insights. All input is anonymous.",
    },
    {
      id: "Twelve",
      question: "Can I use the chatbot on mobile?",
      answer:
        "Yes — the AI tool is mobile-friendly and works smoothly on most smartphones and tablets.",
    },
    {
      id: "Thirteen",
      question: "Can the chatbot give me a yes or no answer?",
      answer:
        "No — the AI is designed to guide you with general suggestions, not specific answers. It will help you explore your options, not tell you what to do.",
    },
    {
      id: "Fourteen",
      question: "Does the chatbot record what I say?",
      answer:
        "No — we don’t store or track your questions. The tool is designed to work anonymously and does not collect personal or financial data.",
    },
  ].map(({ id, question, answer, expanded }, index) => (
    <div className="accordion-item" key={id}>
      <h2 className="accordion-header" id={`heading${id}`}>
        <button
          className={`accordion-button ${expanded ? "" : "collapsed"}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${id}`}
          aria-expanded={expanded ? "true" : "false"}
          aria-controls={`collapse${id}`}
        >
          <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
          <span>{question}</span>
        </button>
      </h2>
      <div
        id={`collapse${id}`}
        className={`accordion-collapse collapse ${expanded ? "show" : ""}`}
        aria-labelledby={`heading${id}`}
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  ))}
</div>

        <button className="see-details-btn">See Details</button>
      </div>
      {/* FAQ SECTION ENDS HERE */}

      {/* how it works section start */}
      <div className="container pt-5 pb-5">
        <div className="row mb-4 align-items-center">
          <div className="col-md-7 section-header">
            <h2>
            Learn How It Works 
            </h2>
          </div>
          <div className="col-md-5 text-md-end">
            <p>
            Our AI tool is designed to be simple, accessible, and genuinely helpful — no complex forms, no jargon, no sales talk. 
            </p>
            <button className="see-details-btn mt-3">See Details</button>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/finance.png" alt="Budget Insights" />
              </div>
              <h5>Share a bit about your financial situation</h5>
              <p>
              The tool will ask a few simple questions to understand your income, goals, or habits (all anonymously, of course). 
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card insight-card-blue">
              <div className="icon-box">
                <img src="./images/guidance.png" alt="Debt Managements" />
              </div>
              <h5>Get guidance and insights</h5>
              <p>
              Based on your input, the AI will generate relevant suggestions, highlight areas to explore, and offer links to tools and services others in the UK often use. 
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/explore.png" alt="Investment Guidance" />
              </div>
              <h5>Explore Further</h5>
              <p>
              Ask a Question – Want to start investing? Looking for budgeting tools to help manage your money? Ask our AI.  
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight-card">
              <div className="icon-box">
                <img src="./images/next-step.png" alt="Financial Health Score" />
              </div>
              <h5>Take the next step</h5>
              <p>
              You stay in control. There’s no account required and no advice given — just helpful ideas you can explore in your own time.
              </p>
            </div>
          </div>
        </div>
      <div className="col-lg-12 pt-5 pb-5">
        <p>
        The guidance you receive is general and for informational purposes only. You should always do your own research or speak with a regulated adviser before making financial decisions. 
        </p>
        <p>
        We may suggest click throughs to trusted UK financial providers. These are affiliate links — we may earn a commission if you choose to sign up, at no extra cost to you. 
        </p>
      </div>
      </div>
      {/* how it works section ends here */}

      {/* FORM SECTION START */}
      <div className="container">
        <h2 className="my-h2 text-center">
          Achieve Your Financial Goals with <br /> a Personalized Assessment
        </h2>
        <div className="container form-container" style={{ display: "flex", marginTop: 50 }}>
          {/* Sidebar with Tabs */}
          <div className="sidebar">
            <button className={`tab-btn ${activeTab === 0 ? "active" : ""}`} onClick={() => showTab(0)}>
              Personal Financial Overview
            </button>
            <button className={`tab-btn ${activeTab === 1 ? "active" : ""}`} onClick={() => showTab(1)}>
              Income & Expenses
            </button>
            <button className={`tab-btn ${activeTab === 2 ? "active" : ""}`} onClick={() => showTab(2)}>
              Savings & Goals
            </button>
            <button className={`tab-btn ${activeTab === 3 ? "active" : ""}`} onClick={() => showTab(3)}>
              Investments
            </button>
            <button className={`tab-btn ${activeTab === 4 ? "active" : ""}`} onClick={() => showTab(4)}>
              Debt Management
            </button>
            <button className={`tab-btn ${activeTab === 5 ? "active" : ""}`} onClick={() => showTab(5)}>
              Retirement Planning
            </button>
            <button className={`tab-btn ${activeTab === 6 ? "active" : ""}`} onClick={() => showTab(6)}>
              Tax Optimization
            </button>
            <button className={`tab-btn ${activeTab === 7 ? "active" : ""}`} onClick={() => showTab(7)}>
              Financial Education
            </button>
            <button className={`tab-btn ${activeTab === 8 ? "active" : ""}`} onClick={() => showTab(8)}>
              Complete
            </button>
          </div>

          {/* Form Content */}
          <div className="form-content">
            {/* Personal Financial Overview */}
            <div className={`form-section ${activeTab === 0 ? "active" : ""}`}>
              <h2>Personal Financial Overview (Net Worth Calculation)</h2>
              <p>Please provide information about your assets and liabilities</p>
              <div className="form-group">
                <label>Total cash savings (bank accounts, ISAs, emergency fund)?</label>
                <input
                  type="text"
                  placeholder="£ Enter amount"
                  value={cashSavings}
                  onChange={(e) => setCashSavings(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Do you own any real estate properties?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={ownsRealEstate === true}
                      onChange={() => setOwnsRealEstate(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={ownsRealEstate === false}
                      onChange={() => setOwnsRealEstate(false)}
                    /> No
                  </label>
                </div>
              </div>
              {ownsRealEstate && (
                <>
                  <div className="form-group">
                    <label>How many properties do you own?</label>
                    <input
                      type="number"
                      placeholder="Enter number"
                      value={numProperties}
                      onChange={(e) => setNumProperties(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Estimated market value of primary residence</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={primaryResidenceValue}
                      onChange={(e) => setPrimaryResidenceValue(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Do you own rental or investment properties?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={ownsInvestmentProperties === true}
                      onChange={() => setOwnsInvestmentProperties(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={ownsInvestmentProperties === false}
                      onChange={() => setOwnsInvestmentProperties(false)}
                    /> No
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Do you have investments (stocks, bonds, ETFs, crypto)?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={hasInvestments === true}
                      onChange={() => setHasInvestments(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={hasInvestments === false}
                      onChange={() => setHasInvestments(false)}
                    /> No
                  </label>
                </div>
              </div>
              {hasInvestments && (
                <div className="form-group">
                  <label>Total estimated value of investments</label>
                  <input
                    type="text"
                    placeholder="£ Enter amount"
                    value={investmentsValue}
                    onChange={(e) => setInvestmentsValue(e.target.value)}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Do you have valuable assets (e.g., jewelry, art)?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={hasValuableAssets === true}
                      onChange={() => setHasValuableAssets(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={hasValuableAssets === false}
                      onChange={() => setHasValuableAssets(false)}
                    /> No
                  </label>
                </div>
              </div>
              {hasValuableAssets && (
                <div className="form-group">
                  <label>Total estimated value of valuable assets</label>
                  <input
                    type="text"
                    placeholder="£ Enter amount"
                    value={valuableAssetsValue}
                    onChange={(e) => setValuableAssetsValue(e.target.value)}
                  />
                </div>
              )}
              <div className="nav-buttons">
                <button className="btn-next" onClick={() => showTab(1)}>
                  Next →
                </button>
              </div>
            </div>

            {/* Income & Expenses */}
            <div className={`form-section ${activeTab === 1 ? "active" : ""}`}>
              <h2>Income & Expenses (Budgeting & Cash Flow)</h2>
              <p>Please provide information about your income and expenses</p>
              <div className="form-group">
                <label>Total monthly income (salary, business, side hustles)?</label>
                <input
                  type="text"
                  placeholder="£ Enter amount"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Do you receive rental income?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={receivesRentalIncome === true}
                      onChange={() => setReceivesRentalIncome(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={receivesRentalIncome === false}
                      onChange={() => setReceivesRentalIncome(false)}
                    /> No
                  </label>
                </div>
              </div>
              {receivesRentalIncome && (
                <div className="form-group">
                  <label>If yes, how much do you receive monthly?</label>
                  <input
                    type="text"
                    placeholder="£ Enter amount"
                    value={monthlyRentalIncome}
                    onChange={(e) => setMonthlyRentalIncome(e.target.value)}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Total monthly fixed expenses (mortgage/rent, utilities, insurance, debt repayments)?</label>
                <input
                  type="text"
                  placeholder="£ Enter amount"
                  value={monthlyFixedExpenses}
                  onChange={(e) => setMonthlyFixedExpenses(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Total monthly variable expenses (groceries, dining, transport, entertainment)?</label>
                <input
                  type="text"
                  placeholder="£ Enter amount"
                  value={monthlyVariableExpenses}
                  onChange={(e) => setMonthlyVariableExpenses(e.target.value)}
                />
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(0)}>
                  ← Back to Financial Overview
                </button>
                <button className="btn-next" onClick={() => showTab(2)}>
                  Savings & Goals →
                </button>
              </div>
            </div>

            {/* Savings & Goals */}
            <div className={`form-section ${activeTab === 2 ? "active" : ""}`}>
              <h2>Savings & Financial Goals</h2>
              <p>Please provide information about your savings and financial goals</p>
              <div className="form-group">
                <label>How much do you have saved in an emergency fund?</label>
                <input
                  type="text"
                  placeholder="£ Enter amount"
                  value={emergencyFund}
                  onChange={(e) => setEmergencyFund(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>How many months of living expenses can your emergency fund cover?</label>
                <input
                  type="number"
                  placeholder="Enter number of months"
                  value={emergencyFundCoverageMonths}
                  onChange={(e) => setEmergencyFundCoverageMonths(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Are you currently saving for any financial goals?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={hasSavingsGoals === true}
                      onChange={() => setHasSavingsGoals(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={hasSavingsGoals === false}
                      onChange={() => setHasSavingsGoals(false)}
                    /> No
                  </label>
                </div>
              </div>
              {hasSavingsGoals && (
                <>
                  <div className="form-group">
                    <label>Goal 1:</label>
                    <input
                      type="text"
                      placeholder="Enter goal description"
                      value={savingsGoal1Description}
                      onChange={(e) => setSavingsGoal1Description(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Target amount:</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={savingsGoal1Amount}
                      onChange={(e) => setSavingsGoal1Amount(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>How much do you contribute to savings each month?</label>
                <input
                  type="text"
                  placeholder="£ Enter amount"
                  value={monthlySavingsContribution}
                  onChange={(e) => setMonthlySavingsContribution(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Are you planning to buy property in the next 5 years?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={plansToBuyProperty === true}
                      onChange={() => setPlansToBuyProperty(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={plansToBuyProperty === false}
                      onChange={() => setPlansToBuyProperty(false)}
                    /> No
                  </label>
                </div>
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(1)}>
                  ← Back to Income & Expenses
                </button>
                <button className="btn-next" onClick={() => showTab(3)}>
                  Investments →
                </button>
              </div>
            </div>

            {/* Investments */}
            <div className={`form-section ${activeTab === 3 ? "active" : ""}`}>
              <h2>Investments & Wealth Building</h2>
              <p>Please provide information about your investment strategy</p>
              <div className="form-group">
                <label>Do you currently invest in stocks, bonds, or other financial assets?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={investsInFinancialAssets === true}
                      onChange={() => setInvestsInFinancialAssets(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={investsInFinancialAssets === false}
                      onChange={() => setInvestsInFinancialAssets(false)}
                    /> No
                  </label>
                </div>
              </div>
              {investsInFinancialAssets && (
                <>
                  <div className="form-group">
                    <label>What percentage of your income do you allocate to investments?</label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Enter percentage"
                        value={investmentAllocationPercentage}
                        onChange={(e) => setInvestmentAllocationPercentage(e.target.value)}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>How comfortable are you with investment risk?</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          value="Low"
                          checked={investmentRiskComfort === "Low"}
                          onChange={() => setInvestmentRiskComfort("Low")}
                        /> Low
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="Medium"
                          checked={investmentRiskComfort === "Medium"}
                          onChange={() => setInvestmentRiskComfort("Medium")}
                        /> Medium
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="High"
                          checked={investmentRiskComfort === "High"}
                          onChange={() => setInvestmentRiskComfort("High")}
                        /> High
                      </label>
                    </div>
                  </div>
                </>
              )}
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(2)}>
                  ← Back to Savings & Goals
                </button>
                <button className="btn-next" onClick={() => showTab(4)}>
                  Debt Management →
                </button>
              </div>
            </div>

            {/* Debt Management */}
            <div className={`form-section ${activeTab === 4 ? "active" : ""}`}>
              <h2>Debt Management</h2>
              <p>Please provide information about your debt management strategy</p>
              <div className="form-group">
                <label>Do you have a mortgage?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={hasMortgage === true}
                      onChange={() => setHasMortgage(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={hasMortgage === false}
                      onChange={() => setHasMortgage(false)}
                    /> No
                  </label>
                </div>
              </div>
              {hasMortgage && (
                <>
                  <div className="form-group">
                    <label>Current mortgage balance</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={mortgageBalance}
                      onChange={(e) => setMortgageBalance(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Monthly mortgage payment</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={monthlyMortgagePayment}
                      onChange={(e) => setMonthlyMortgagePayment(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mortgage interest rate</label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Enter percentage"
                        value={mortgageInterestRate}
                        onChange={(e) => setMortgageInterestRate(e.target.value)}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Years left on mortgage</label>
                    <input
                      type="number"
                      placeholder="Enter years"
                      value={mortgageYearsLeft}
                      onChange={(e) => {
                        setMortgageYearsLeft(e.target.value);
                        validateYears(e.target.value, setMortgageYearsLeftError);
                      }}
                    />
                    {mortgageYearsLeftError && <p className="error-message">{mortgageYearsLeftError}</p>}
                  </div>
                  <div className="form-group">
                    <label>Do you plan to pay off your mortgage early?</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          value="Yes"
                          checked={plansToPayOffMortgageEarly === true}
                          onChange={() => setPlansToPayOffMortgageEarly(true)}
                        /> Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="No"
                          checked={plansToPayOffMortgageEarly === false}
                          onChange={() => setPlansToPayOffMortgageEarly(false)}
                        /> No
                      </label>
                    </div>
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Do you have other debts (credit cards, loans)?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Yes"
                      checked={hasOtherDebts === true}
                      onChange={() => setHasOtherDebts(true)}
                    /> Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="No"
                      checked={hasOtherDebts === false}
                      onChange={() => setHasOtherDebts(false)}
                    /> No
                  </label>
                </div>
              </div>
              {hasOtherDebts && (
                <>
                  <div className="form-group">
                    <label>Total balance of other debts</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={otherDebtBalance}
                      onChange={(e) => setOtherDebtBalance(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Monthly repayment for other debts</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={monthlyDebtRepayment}
                      onChange={(e) => setMonthlyDebtRepayment(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total monthly debt repayment amount</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={monthlyDebtRepaymentTotal}
                      onChange={(e) => setMonthlyDebtRepaymentTotal(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(3)}>
                  ← Back to Investments
                </button>
                <button className="btn-next" onClick={() => showTab(5)}>
                  Retirement Planning →
                </button>
              </div>
            </div>

            {/* Retirement Planning */}
            <div className={`form-section ${activeTab === 5 ? "active" : ""}`}>
              <h2>Retirement Planning</h2>
              <p>Please provide information about your retirement plans</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Do you have a workplace pension?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={hasWorkplacePension === true}
                        onChange={() => setHasWorkplacePension(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={hasWorkplacePension === false}
                        onChange={() => setHasWorkplacePension(false)}
                      /> No
                    </label>
                  </div>
                </div>
                {hasWorkplacePension && (
                  <div className="form-group">
                    <label>If yes, what is your current pension balance?</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={pensionBalance}
                      onChange={(e) => setPensionBalance(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Does your employer match contributions?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={employerMatchesPension === true}
                        onChange={() => setEmployerMatchesPension(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={employerMatchesPension === false}
                        onChange={() => setEmployerMatchesPension(false)}
                      /> No
                    </label>
                  </div>
                </div>
                {employerMatchesPension && (
                  <div className="form-group">
                    <label>How much do you contribute monthly?</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={monthlyPensionContribution}
                      onChange={(e) => setMonthlyPensionContribution(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Do you have a private pension (SIPP, LISA, or other)?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={hasPrivatePension === true}
                        onChange={() => setHasPrivatePension(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={hasPrivatePension === false}
                        onChange={() => setHasPrivatePension(false)}
                      /> No
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Do you plan to use property equity (downsizing, rental income) in retirement?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={plansToUsePropertyEquity === true}
                        onChange={() => setPlansToUsePropertyEquity(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={plansToUsePropertyEquity === false}
                        onChange={() => setPlansToUsePropertyEquity(false)}
                      /> No
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>At what age do you plan to retire?</label>
                  <input
                    type="text"
                    placeholder="Enter age"
                    value={plannedRetirementAge}
                    onChange={(e) => {
                      setPlannedRetirementAge(e.target.value);
                      validateYears(e.target.value, setPlannedRetirementAgeError);
                    }}
                  />
                  {plannedRetirementAgeError && <p className="error-message">{plannedRetirementAgeError}</p>}
                </div>
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(4)}>
                  ← Back to Debt Management
                </button>
                <button className="btn-next" onClick={() => showTab(6)}>
                  Tax Optimization →
                </button>
              </div>
            </div>

            {/* Tax Optimization */}
            <div className={`form-section ${activeTab === 6 ? "active" : ""}`}>
              <h2>Tax Optimization</h2>
              <p>Please provide information about your tax planning strategies</p>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Do you contribute to tax-efficient investment accounts (Stocks & Shares ISA, Pension, LISA)?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={usesTaxEfficientAccounts === true}
                        onChange={() => setUsesTaxEfficientAccounts(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={usesTaxEfficientAccounts === false}
                        onChange={() => setUsesTaxEfficientAccounts(false)}
                      /> No
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Have you maxed out your annual ISA allowance?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={maxedIsaAllowance === true}
                        onChange={() => setMaxedIsaAllowance(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={maxedIsaAllowance === false}
                        onChange={() => setMaxedIsaAllowance(false)}
                      /> No
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Do you track your capital gains for tax purposes?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={tracksCapitalGains === true}
                        onChange={() => setTracksCapitalGains(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={tracksCapitalGains === false}
                        onChange={() => setTracksCapitalGains(false)}
                      /> No
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Do you donate to charity and claim tax relief (Gift Aid)?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={donatesToCharity === true}
                        onChange={() => setDonatesToCharity(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={donatesToCharity === false}
                        onChange={() => setDonatesToCharity(false)}
                      /> No
                    </label>
                  </div>
                </div>
              </div>
              {donatesToCharity && (
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>If yes, how much do you donate monthly?</label>
                    <input
                      type="text"
                      placeholder="£ Enter amount"
                      value={charityDonationAmount}
                      onChange={(e) => setCharityDonationAmount(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(5)}>
                  ← Back to Retirement Planning
                </button>
                <button className="btn-next" onClick={() => showTab(7)}>
                  Financial Education →
                </button>
              </div>
            </div>

            {/* Financial Education */}
            <div className={`form-section ${activeTab === 7 ? "active" : ""}`}>
              <h2>Financial Education & Planning Preferences</h2>
              <p>Please provide information about your financial education needs</p>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>What financial topics do you need the most help with? (Select all that apply)</label>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        value="Investment Planning"
                        checked={needsInvestmentHelp}
                        onChange={(e) => setNeedsInvestmentHelp(e.target.checked)}
                      /> Investment Planning
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>Do you currently use financial tools/apps to track your finances?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={usesFinancialTools === true}
                        onChange={() => setUsesFinancialTools(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={usesFinancialTools === false}
                        onChange={() => setUsesFinancialTools(false)}
                      /> No
                    </label>
                  </div>
                </div>
                {usesFinancialTools && (
                  <div className="form-group half-width">
                    <label>If yes, which one(s)?</label>
                    <input
                      type="text"
                      placeholder="Enter tools/apps"
                      value={financialTools}
                      onChange={(e) => setFinancialTools(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Would you be interested in a personalized financial plan based on this data?</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="Yes"
                        checked={wantsPersonalizedPlan === true}
                        onChange={() => setWantsPersonalizedPlan(true)}
                      /> Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="No"
                        checked={wantsPersonalizedPlan === false}
                        onChange={() => setWantsPersonalizedPlan(false)}
                      /> No
                    </label>
                  </div>
                </div>
              </div>
              <div className="nav-buttons">
                <button className="btn-back" onClick={() => showTab(6)}>
                  ← Back to Tax Optimization
                </button>
                <button className="btn-next" onClick={() => showTab(8)}>
                  Complete →
                </button>
              </div>
            </div>

            {/* Success Message */}
            <div className={`form-section ${activeTab === 8 ? "active" : ""}`} id="success-message" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, color: "#2B63E1", marginBottom: 20 }}>
                <i className="fa-regular fa-circle-check" />
              </div>
              <h2>Thank You for Completing Your Financial Assessment!</h2>
              <p>
                Your information has been submitted successfully. Our financial advisors will review your data and contact you shortly with personalized recommendations.
              </p>
              <button className="btn-start" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "View Summary"}
              </button>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>


        {insights && (
      <div className="report-container" ref={reportRef}>
        <div className="report-header">
          <h1>Financial Insights Report</h1>
          <p>Generated on: {new Date().toLocaleDateString()}</p>
        </div>
 
        <div className="report-content">
          {/* Sidebar for Charts */}
          <div className="report-sidebar">
            {/* Net Worth Chart */}
            <div className="chart-section">
              <Bar data={netWorthData} options={netWorthOptions} />
              <p>Total Net Worth: £{(insights?.net_worth?.total ?? 0).toFixed(2)}</p>
            </div>
 
            {/* Cash Flow Charts */}
            <div className="chart-section">
              <Pie data={cashFlowExpensesData} options={cashFlowExpensesOptions} />
            </div>
            <div className="chart-section">
              <Bar data={cashFlowIncomeData} options={cashFlowIncomeOptions} />
            </div>
 
            {/* Debt Chart */}
            <div className="chart-section">
              <Bar data={debtData} options={debtOptions} />
              <p>Interest Rate: {(insights?.debt?.mortgage_interest_rate ?? 0).toFixed(2)}%</p>
            </div>
 
            {/* Investments & Savings Chart */}
            <div className="chart-section">
              <Pie data={investmentsSavingsData} options={investmentsSavingsOptions} />
              <p>Allocation: {(insights?.investments_savings?.investment_allocation_percentage ?? 0).toFixed(2)}%</p>
            </div>
 
            {/* Retirement Chart */}
            <div className="chart-section">
              <Bar data={retirementData} options={retirementOptions} />
              <p>Employer Match: {(insights?.retirement?.employer_matches_pension ?? false) ? "Yes" : "No"}</p>
            </div>
          </div>
 
          {/* Main Content for Detailed Insights */}
          <div className="report-main">
            {/* Recommendations Section */}
            <div className="insights-subsection">
              <h3>Recommendations</h3>
              {(insights?.recommendations?.recommadations ?? []).map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <h4>{rec?.action ?? "No Action Provided"}</h4>
                  <p>{rec?.recommendation ?? "No Recommendation Provided"}</p>
                </div>
              ))}
            </div>
 
            {/* Insights Section in Table Format */}
            <div className="insights-subsection">
              <h3>Insights</h3>
              <table className="insights-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Budget Insights */}
                  <tr>
                    <td>Budget Insights</td>
                    <td>
                      <p><strong>Categorize Expenses:</strong> {insights?.recommendations?.insights?.budget_insights?.categorize_expenses ?? "Not Available"}</p>
                      <p><strong>Flag Overspending:</strong> {insights?.recommendations?.insights?.budget_insights?.flag_overspending ?? "Not Available"}</p>
                      <p><strong>Savings Rate:</strong> {insights?.recommendations?.insights?.budget_insights?.savings_rate ?? "Not Available"}</p>
                      <p><strong>Improvements:</strong> {insights?.recommendations?.insights?.budget_insights?.improvements ?? "Not Available"}</p>
                    </td>
                  </tr>
 
                  {/* Debt Management */}
                  <tr>
                    <td>Debt Management</td>
                    <td>
                      <p><strong>Debt-to-Income Ratio:</strong> {insights?.recommendations?.insights?.debt_management?.debt_to_income_ratio ?? "Not Available"}</p>
                      <p><strong>Repayment Strategies:</strong> {insights?.recommendations?.insights?.debt_management?.repayment_strategies ?? "Not Available"}</p>
                      <p><strong>Improvements:</strong> {insights?.recommendations?.insights?.debt_management?.improvements ?? "Not Available"}</p>
                    </td>
                  </tr>
 
                  {/* Investment Guidance */}
                  <tr>
                    <td>Investment Guidance</td>
                    <td>
                      <p><strong>Asset Allocation:</strong> {insights?.recommendations?.insights?.investment_guidance?.asset_allocation ?? "Not Available"}</p>
                      <p><strong>Diversification Suggestions:</strong> {insights?.recommendations?.insights?.investment_guidance?.diversification_suggestions ?? "Not Available"}</p>
                      <p><strong>Improvements:</strong> {insights?.recommendations?.insights?.investment_guidance?.improvements ?? "Not Available"}</p>
                    </td>
                  </tr>
 
                  {/* Financial Health Score */}
                  <tr>
                    <td>Financial Health Score</td>
                    <td>
                      <p><strong>Overall Rating:</strong> {insights?.recommendations?.insights?.financial_health_score?.overall_rating ?? "Not Available"}</p>
                      <p><strong>Strengths:</strong> {insights?.recommendations?.insights?.financial_health_score?.strengths ?? "Not Available"}</p>
                      <p><strong>Weaknesses:</strong> {insights?.recommendations?.insights?.financial_health_score?.weaknesses ?? "Not Available"}</p>
                      <p><strong>Improvements:</strong> {insights?.recommendations?.insights?.financial_health_score?.improvements ?? "Not Available"}</p>
                    </td>
                  </tr>
 
                  {/* Custom Recommendations */}
                  <tr>
                    <td>Custom Recommendations</td>
                    <td>
                      <p><strong>Expense Reduction:</strong> {insights?.recommendations?.insights?.custom_recommendations?.expense_reduction ?? "Not Available"}</p>
                      <p><strong>Savings Optimization:</strong> {insights?.recommendations?.insights?.custom_recommendations?.savings_optimization ?? "Not Available"}</p>
                      <p><strong>Tax Strategies:</strong> {insights?.recommendations?.insights?.custom_recommendations?.tax_strategies ?? "Not Available"}</p>
                      <p><strong>Retirement Planning:</strong> {insights?.recommendations?.insights?.custom_recommendations?.retirement_planning ?? "Not Available"}</p>
                      <p><strong>Improvements:</strong> {insights?.recommendations?.insights?.custom_recommendations?.improvements ?? "Not Available"}</p>
                    </td>
                  </tr>
 
                  {/* Retirement Planning */}
                  <tr>
                    <td>Retirement Planning</td>
                    <td>
                      <p><strong>Future Savings Projection:</strong> {insights?.recommendations?.insights?.retirement_planning?.future_savings_projection ?? "Not Available"}</p>
                      <p><strong>Improvements:</strong> {insights?.recommendations?.insights?.retirement_planning?.improvements ?? "Not Available"}</p>
                    </td>
                  </tr>
 
                  {/* Disclaimer */}
                  <tr>
                    <td>Disclaimer</td>
                    <td>
                      <p>{insights?.recommendations?.insights?.disclaimer?.disclaimer ?? "No Disclaimer Available"}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
 
        <div className="report-footer">
          <p>Prepared by: Financial Assessment Team</p>
          <p>Contact: support@financeapp.com | © {new Date().getFullYear()} FinanceApp</p>
        </div>
      </div>
    )}
 
      {insights && (
       
        <div className="download-button-container">
         
           { isDownloading ?  <><button className="download-button"
          aria-label={isDownloading ? "Downloading report, please wait" : "Download report"}
          ><i className="fas fa-download"></i> Downloading...</button></> : <><button className="download-button" disabled={isDownloading}  onClick={downloadReport}
          aria-label={isDownloading ? "Downloading report, please wait" : "Download report"}
          ><i className="fas fa-download"></i> Download Report</button></> }
         
        </div>
      )}
 

      </div>
       {/* FORM SECTION ENDS HERE */}



      {/* QUERY SECTION START */}
      <div className="container query-section">
        <h2 className="my-h2">
          Transform Your Financial Goals
          <br />
          into Actionable Plans
        </h2>
        <div className="query-input-wrapper">
          <form className="query-form" id="queryForm" onSubmit={handleSubmitQuery}>
            <input
              type="text"
              className="form-control query-input"
              id="queryInput"
              placeholder="Ask your financial query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="query-btn">
              <i className="fas fa-paper-plane" />
            </button>
          </form>
        </div>
        {/* Error Message */}
        {queryError && <p className="error-message">{queryError}</p>}
        {/* Result Display Area */}
        <div className={`result-box ${isResultVisible ? "" : "d-none"}`} id="resultBox">
          <div className="result-keyword" id="displayKeyword">
            {keyword}
          </div>
          {htmlDesign ? (
            // Render the HTML content from html_design
            <div
              className="html-design-content"
              dangerouslySetInnerHTML={{ __html: getBodyContent(htmlDesign) }}
            />
          ) : (
            // Fallback to table display if no html_design
            <div className="table-responsive">
              Generating Result..
            </div>
          )}
        </div>
      </div>
      {/* QUERY SECTION ENDS */}

      {/* SUBSCRIBE SECTION START */}
      <div className="container">
        <div className="subscribe-section">
          <h2 className="subscribe-title">
            Navigating Your Investment Journey with Confidence.
          </h2>
          <p className="subscribe-desc">
            Curious about how to kickstart your investment journey? Explore our
            comprehensive FAQ section designed to provide clarity and guidance on
            various aspects of investing through QuantElite.
          </p>
          <form className="subscribe-form">
            <input
              type="email"
              className="subscribe-input"
              placeholder="Enter your email"
              required=""
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </form>
          <img
            src="./images/SUBSCRIBE.png"
            alt="Subscribe Image"
            className="subscribe-img"
          />
        </div>
      </div>
      {/* SUBSCRIBE SECTION ENDS */}

      {/* FEEDBACK SECTION START */}
      <div className="container feedback-section">
        <h2 className="my-h2">
          Help Shape AI-Powered Personal
          <br />
          <span>Finance</span>
        </h2>
        <form className="mt-4 col-lg-12 mx-auto text-left">
          <div className="mb-3 text-control">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name..."
            />
          </div>
          <div className="mb-3 text-control">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Email..."
            />
          </div>
          <div className="mb-3 text-control">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              rows={4}
              placeholder="Give Your Feedback..."
              defaultValue={""}
            />
          </div>
          <div className="text-center">
            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
      {/* FEEDBACK SECTION ENDS */}


      {/* FOOTER SECTION START */}
      <Footer></Footer>
      {/* FOOTER SECTION ENDS HERE */}

    </>


  );
};

export default Home;