# ShopSense AI 🔮

> **Real-time E-commerce Purchase Intention Predictor** powered by Machine Learning.

ShopSense AI is a full-stack predictive analytics platform designed to analyze e-commerce shopper session data and predict purchase behavior (purchase completion vs. cart abandonment) in real time. Using a **Random Forest Classifier** trained on the Online Shoppers Purchasing Intention dataset, the platform achieves **90.06% accuracy** (ROC-AUC of **0.918**) to provide shop owners with actionable customer behavioral insights.

---

## 🌟 Features

* **Interactive Dashboard**: Real-time API status tracking, key model performance metrics (ROC-AUC, sample sizes), and flow descriptions.
* **Single Prediction Interface**: Easy-to-use sliders and dropdowns to evaluate custom customer sessions based on page durations, exit rates, and page values.
* **Smart Recommendations**: The AI goes beyond prediction, offering context-aware suggestions (e.g., offering discounts for long browsing times, optimizing landing pages for high bounce rates, or using exit-intent popups).
* **Bulk Prediction Engine**: Upload CSV lists of shopper profiles to get bulk conversion rates, total projected buyers, and granular insights instantly.
* **Jupyter Data Exploration**: Pre-built notebooks containing data visualizations, feature correlations, and outlier analysis.

---

## 🛠️ Tech Stack

### Frontend
* **React 19** & **Vite** — High-performance, reactive UI development
* **Tailwind CSS v4** — Clean, modern, responsive glassmorphism styles
* **React Router Dom** — Seamless page navigation

### Backend & Machine Learning
* **FastAPI** — High-performance web framework for APIs
* **Scikit-Learn** & **Joblib** — Model evaluation and pickled pipeline loader
* **Pandas** & **NumPy** — Data processing and transformation
* **Uvicorn** — ASGI web server

---

## 📁 Repository Structure

```text
shopsense-ai/
├── backend/            # FastAPI Backend Application
│   ├── model/          # Pre-trained Random Forest model and preprocessors
│   ├── main.py         # API entry point and prediction routes
│   └── requirements.txt# Backend Python dependencies
├── frontend/           # Vite + React Frontend Application
│   ├── src/            # Source code (Components, Pages, Utilities)
│   └── package.json    # Frontend Node dependencies
├── notebook/           # Jupyter notebooks for model training & EDA
│   ├── analysis.ipynb  # Interactive data analysis notebook
│   └── *.png           # Saved correlation and target distribution charts
└── report/             # Workspace for exported reports and analytics
```

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have the following installed on your machine:
* Python 3.8+
* Node.js 18+

### 2. Backend Setup
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   * The API docs will be available at: http://localhost:8000/docs
   * The server runs on http://localhost:8000

### 3. Frontend Setup
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * The client application will be available at: http://localhost:5173

### 4. Notebook Exploration
To run the analysis notebook, navigate to the `notebook/` directory and spin up Jupyter:
```bash
cd notebook
jupyter notebook
```

---

## 📈 Model Performance

* **Model**: Random Forest Classifier
* **Accuracy**: `90.06%`
* **ROC-AUC**: `0.918`
* **Features Analyzed**: `17` (including page durations, bounce/exit rates, visitor types, and page values)
