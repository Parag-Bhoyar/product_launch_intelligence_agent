import { useState } from "react";
import "./App.css";

function App() {
  const [productDescription, setProductDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeProduct = async () => {
    if (!productDescription.trim()) {
      setError("Please describe your product first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/launch/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_description: productDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze product.");
      }

      const data = await response.json();

      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) {
      return "score-ready";
    }

    if (score >= 60) {
      return "score-validation";
    }

    return "score-risk";
  };

  const handleNewAnalysis = () => {
    setProductDescription("");
    setAnalysis(null);
    setError("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          Product Launch Intelligence
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Research Agent
        </div>
      </header>

      <main className="container">
        {/* HERO */}
        <section className="hero">
          <div className="eyebrow">
            AI-POWERED PRODUCT RESEARCH
          </div>

          <h1>
            Turn your product idea into
            <span> launch intelligence.</span>
          </h1>

          <p className="hero-description">
            Research your market, understand your customers, analyze
            competitors, and generate a practical launch strategy.
          </p>
        </section>

        {/* INPUT */}
        <section className="input-card">
          <label htmlFor="product">
            Describe your product
          </label>

          <textarea
            id="product"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Example: A smart reusable water bottle that tracks daily water intake and reminds users to drink water."
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="analyze-button"
            onClick={analyzeProduct}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Product"}
          </button>
        </section>

        {/* LOADING */}
        {loading && (
          <section className="loading-card">
            <div className="spinner"></div>

            <h3>
              Researching your product...
            </h3>

            <p>
              Our AI agent is researching the market and generating
              launch intelligence.
            </p>
          </section>
        )}

        {/* RESULTS */}
        {analysis && !loading && (
          <section className="results">
            <div className="results-header">
              <div className="eyebrow">
                ANALYSIS COMPLETE
              </div>

              <h2>
                Product Launch Intelligence
              </h2>

              <p>
                AI-generated research and recommendations based on
                your product idea.
              </p>
            </div>

            {/* LAUNCH READINESS */}
            {analysis.launch_readiness_score !== undefined && (
              <section className="readiness-card">
                <div className="card-label">
                  LAUNCH READINESS
                </div>

                <div className="readiness-content">
                  <div className="score-area">
                    <div
                      className={`score ${getScoreClass(
                        analysis.launch_readiness_score
                      )}`}
                    >
                      {analysis.launch_readiness_score}
                      <span>/100</span>
                    </div>

                    <div className="verdict">
                      {analysis.launch_verdict}
                    </div>
                  </div>

                  <div
                    className="score-ring"
                    style={{
                      "--score": `${
                        Math.min(
                          Math.max(
                            analysis.launch_readiness_score,
                            0
                          ),
                          100
                        ) * 3.6
                      }deg`,
                    }}
                  >
                    <div className="score-ring-inner">
                      <strong>
                        {analysis.launch_readiness_score}
                      </strong>
                      <span>READINESS</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* PRODUCT OVERVIEW */}
            <section className="result-card">
              <h3>
                Product Overview
              </h3>

              <p>
                {analysis.product_overview}
              </p>
            </section>

            {/* TARGET MARKET + CUSTOMER SEGMENTS */}
            <div className="result-grid">
              <section className="result-card">
                <h3>
                  Target Market
                </h3>

                <ul>
                  {analysis.target_market?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </section>

              <section className="result-card">
                <h3>
                  Customer Segments
                </h3>

                <ul>
                  {analysis.customer_segments?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </section>
            </div>

            {/* MARKET OPPORTUNITY */}
            <section className="result-card">
              <h3>
                Market Opportunity
              </h3>

              <p>
                {analysis.market_opportunity}
              </p>
            </section>

            {/* COMPETITIVE LANDSCAPE */}
            <section className="result-card">
              <div className="section-tag">
                COMPETITIVE LANDSCAPE
              </div>

              <h3>
                Competitors
              </h3>

              <div className="competitors">
                {analysis.competitors?.map(
                  (competitor, index) => (
                    <div
                      className="competitor"
                      key={index}
                    >
                      <div className="competitor-number">
                        {index + 1}
                      </div>

                      <div>
                        <h4>
                          {competitor.name}
                        </h4>

                        <p>
                          {competitor.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* VALUE PROPOSITION */}
            <section className="result-card">
              <h3>
                Unique Value Proposition
              </h3>

              <div className="feature-grid">
                {analysis.unique_value_proposition?.map(
                  (item, index) => (
                    <div
                      className="feature-item"
                      key={index}
                    >
                      <div className="feature-icon">
                        ✓
                      </div>

                      <div>
                        {item}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* GO TO MARKET */}
            <section className="result-card">
              <div className="section-tag">
                GO-TO-MARKET
              </div>

              <h3>
                Launch Strategy
              </h3>

              <div className="strategy-list">
                {analysis.launch_strategy?.map(
                  (item, index) => (
                    <div
                      className="strategy-item"
                      key={index}
                    >
                      <div className="strategy-number">
                        {index + 1}
                      </div>

                      <div>
                        {item}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* MARKETING CHANNELS */}
            <section className="result-card">
              <h3>
                Marketing Channels
              </h3>

              <div className="number-grid">
                {analysis.marketing_channels?.map(
                  (item, index) => (
                    <div
                      className="channel"
                      key={index}
                    >
                      <div className="number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="channel-name">
                        {item}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* RISKS */}
            <section className="result-card risk-card">
              <div className="section-tag">
                RISK ANALYSIS
              </div>

              <h3>
                Key Risks
              </h3>

              <ul className="risk-list">
                {analysis.key_risks?.map(
                  (item, index) => (
                    <li key={index}>
                      <div className="risk-icon">
                        !
                      </div>

                      <div>
                        {item}
                      </div>
                    </li>
                  )
                )}
              </ul>
            </section>

            {/* ACTION PLAN */}
            <section className="result-card action-card">
              <div className="section-tag">
                ACTION PLAN
              </div>

              <h3>
                Recommendations
              </h3>

              <div className="recommendation-list">
                {analysis.recommendations?.map(
                  (item, index) => (
                    <div
                      className="recommendation"
                      key={index}
                    >
                      <div className="recommendation-number">
                        {index + 1}
                      </div>

                      <div>
                        {item}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* NEW ANALYSIS */}
            <div className="new-analysis">
              <button
                className="secondary-button"
                onClick={handleNewAnalysis}
              >
                Analyze Another Product
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;