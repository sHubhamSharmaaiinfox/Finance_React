// src/components/FinancialData.js
import React, { useState,useRef ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../service/client';
import html2canvas from "html2canvas"; 
import jsPDF from "jspdf"; 
import Chart from "chart.js/auto"; 
import DOMPurify from "dompurify"; 






const Home = () => {

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



 



  return (
    <>
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container main-contaier">

        <a className="navbar-brand" href="#">
          <img src="./images/financial-logo.png" alt="Logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <i className="fas fa-bars" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Resources
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Invest
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact Us
              </a>
            </li>
          </ul>
      
          <div className="d-flex">
            <button className="btn me-3">
              <i className="fas fa-search" />
            </button>
            <button className="btn download-btn">Download</button>
          </div>
        </div>
      </div>
    </nav>
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
    <div className="container faq-section">
      <h2 className="my-h2">
        Everything You Need to
        <br />
        Know Before You Start
      </h2>
      <div className="accordion" id="faqAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <span className="faq-number">01</span>
              <span>What does a financial advisor do for me?</span>
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              A financial advisor helps you plan and manage your finances by
              offering expert guidance on budgeting, saving, investing, insurance,
              retirement planning, and more—ensuring your money works smarter for
              your goals.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <span className="faq-number">02</span>
              <span>Is hiring a financial advisor worth the cost?</span>
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Yes, a financial advisor can help optimize your financial decisions,
              potentially saving you money and helping you reach your goals faster
              through effective strategies.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <span className="faq-number">03</span>
              <span>How do I know if my financial advisor is qualified?</span>
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Check for certifications like CFP (Certified Financial Planner),
              experience, references, and a clear fee structure to ensure
              credibility and transparency.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFour">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              <span className="faq-number">04</span>
              <span>What kind of goals can a financial advisor help with?</span>
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Advisors can help with retirement, saving for education, buying
              property, investment strategies, debt management, and general wealth
              building.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingFive">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="false"
              aria-controls="collapseFive"
            >
              <span className="faq-number">05</span>
              <span>Is financial planning only for the wealthy?</span>
            </button>
          </h2>
          <div
            id="collapseFive"
            className="accordion-collapse collapse"
            aria-labelledby="headingFive"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Absolutely not. Financial planning is for everyone. Whether you're
              starting out or growing wealth, proper planning ensures a secure
              future regardless of income level.
            </div>
          </div>
        </div>
      </div>
      <button className="see-details-btn">See Details</button>
    </div>


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
            {/* Sidebar for Numeric Values in Cards */}
            <div className="report-sidebar">
              {/* Net Worth Card */}
              <div className="report-card">
                <h3>Net Worth</h3>
                <div className="card-section">
                  <h4>Assets</h4>
                  <p>Cash Savings: £{(insights?.net_worth?.assets?.cash_savings ?? 0).toFixed(2)}</p>
                  <p>Primary Residence: £{(insights?.net_worth?.assets?.primary_residence_value ?? 0).toFixed(2)}</p>
                  <p>Investments: £{(insights?.net_worth?.assets?.investments_value ?? 0).toFixed(2)}</p>
                  <p>Pension Balance: £{(insights?.net_worth?.assets?.pension_balance ?? 0).toFixed(2)}</p>
                </div>
                <div className="card-section">
                  <h4>Liabilities</h4>
                  <p>Mortgage: £{(insights?.net_worth?.liabilities?.mortgage_balance ?? 0).toFixed(2)}</p>
                  <p>Credit Card: £{(insights?.net_worth?.liabilities?.credit_card_balance ?? 0).toFixed(2)}</p>
                  <p>Personal Loan: £{(insights?.net_worth?.liabilities?.personal_loan_balance ?? 0).toFixed(2)}</p>
                </div>
                <div className="card-section">
                  <h4>Total</h4>
                  <p>£{(insights?.net_worth?.total ?? 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Cash Flow Card */}
              <div className="report-card">
                <h3>Cash Flow</h3>
                <div className="card-section">
                  <h4>Income</h4>
                  <p>Monthly Income: £{(insights?.cash_flow?.income ?? 0).toFixed(2)}</p>
                </div>
                <div className="card-section">
                  <h4>Expenses</h4>
                  <p>Mortgage Payment: £{(insights?.cash_flow?.expenses?.monthly_mortgage_payment ?? 0).toFixed(2)}</p>
                  <p>Fixed Expenses: £{(insights?.cash_flow?.expenses?.monthly_fixed_expenses ?? 0).toFixed(2)}</p>
                  <p>Variable Expenses: £{(insights?.cash_flow?.expenses?.monthly_variable_expenses ?? 0).toFixed(2)}</p>
                  <p>Savings Contribution: £{(insights?.cash_flow?.expenses?.monthly_savings_contribution ?? 0).toFixed(2)}</p>
                  <p>Pension Contribution: £{(insights?.cash_flow?.expenses?.monthly_pension_contribution ?? 0).toFixed(2)}</p>
                </div>
                <div className="card-section">
                  <h4>Net Cash Flow</h4>
                  <p>£{(insights?.cash_flow?.net ?? 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Debt Card */}
              <div className="report-card">
                <h3>Debt</h3>
                <div className="card-section">
                  <p>Mortgage Balance: £{(insights?.debt?.mortgage_balance ?? 0).toFixed(2)}</p>
                  <p>Monthly Payment: £{(insights?.debt?.monthly_mortgage_payment ?? 0).toFixed(2)}</p>
                  <p>Interest Rate: {(insights?.debt?.mortgage_interest_rate ?? 0).toFixed(2)}%</p>
                </div>
              </div>

              {/* Investments & Savings Card */}
              <div className="report-card">
                <h3>Investments & Savings</h3>
                <div className="card-section">
                  <p>Cash Savings: £{(insights?.investments_savings?.cash_savings ?? 0).toFixed(2)}</p>
                  <p>Investments Value: £{(insights?.investments_savings?.investments_value ?? 0).toFixed(2)}</p>
                  <p>Allocation: {(insights?.investments_savings?.investment_allocation_percentage ?? 0).toFixed(2)}%</p>
                </div>
              </div>

              {/* Retirement Card */}
              <div className="report-card">
                <h3>Retirement</h3>
                <div className="card-section">
                  <p>Pension Balance: £{(insights?.retirement?.pension_balance ?? 0).toFixed(2)}</p>
                  <p>Monthly Contribution: £{(insights?.retirement?.monthly_pension_contribution ?? 0).toFixed(2)}</p>
                  <p>Employer Match: {(insights?.retirement?.employer_matches_pension ?? false) ? "Yes" : "No"}</p>
                </div>
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
          <button className="download-button" onClick={downloadReport}>
            <i className="fas fa-download"></i> Download Report
          </button>
        </div>
      )}


    </div>



    
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


    <footer className="footer">
      <div className="container">
        <div className="row text-left">
          {/* Logo & Description */}
          <div className="col-md-3 mb-4 text-control">
            <div className="footer-logo">
              <img src="./images/financial-logo.png" alt="Logo" />
            </div>
            <p className="mt-3">
              At QuantElite, our foundation is built on financial wisdom and a
              commitment to your success
            </p>
          </div>
          {/* Pages */}
          <div className="col-md-3 mb-4 text-control">
            <h6>Pages</h6>
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <a href="#">Resources</a>
            <a href="#">Invest</a>
            <a href="#">Contact Us</a>
          </div>
          {/* Contact Info */}
          <div className="col-md-3 mb-4 text-control">
            <h6>Contact</h6>
            <p>
              10 Downing Street,
              <br />
              London, SW1A 2AA,
              <br />
              United Kingdom
            </p>
            <p>
              <i className="fas fa-envelope me-2" /> Hello@gmail.com
            </p>
            <p>
              <i className="fas fa-phone me-2" /> + (62) 123 456 789
            </p>
          </div>
          {/* Social Icons */}
          <div className="col-md-3 mb-4 text-control">
            <h6>Follow Us</h6>
            <div className="social-icons mb-2">
              <a href="#">
                <i className="fab fa-linkedin-in" />
              </a>
              <a href="#">
                <i className="fab fa-twitter" />
              </a>
              <a href="#">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#">
                <i className="fab fa-youtube" />
              </a>
              <a href="#">
                <i className="fab fa-instagram" />
              </a>
            </div>
            <p>Your Algorand journey starts here</p>
          </div>
        </div>
        <hr />
        <div className="copyright">
          ©2025 QuantElite® Global Inc. All rights reserved.
        </div>
      </div>
    </footer>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  </>
  
  
  );
};

export default Home;