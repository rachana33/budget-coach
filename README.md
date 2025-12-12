# 💰 Budget Coach - Personal Finance Tracker with AI Insights

A full-stack personal finance application that helps you track expenses, set financial goals, and receive AI-powered coaching insights.

## ✨ Features

- 📊 **Dashboard Analytics**: Visual overview of income, expenses, and spending patterns
- 💳 **Account Management**: Track multiple bank accounts and credit cards
- 📝 **Transaction Tracking**: Record and categorize all your transactions
- 🎯 **Goal Setting**: Set and track progress toward financial goals
- 🔄 **Recurring Expenses**: Manage subscriptions and regular bills
- 🤖 **AI Coach**: Get personalized financial advice powered by OpenAI GPT-4
- 📈 **Micro-Habits Analysis**: Discover small spending patterns that add up
- 📅 **Monthly Insights**: Track spending trends over time

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Recharts for data visualization
- Axios for API calls

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL (production) / SQLite (development)
- OpenAI API integration
- Pandas for data analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/budget-coach.git
   cd budget-coach
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   echo "OPENAI_MODEL=gpt-4o-mini" >> .env
   ```

3. **Install dependencies**
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   npm install
   ```

4. **Run the application**
   ```bash
   # Terminal 1 - Backend
   uvicorn backend.app.main:app --reload
   
   # Terminal 2 - Frontend
   npm run frontend
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Render.

**Quick Deploy:**
1. Push code to GitHub
2. Connect repository to Render
3. Deploy using the included `render.yaml` blueprint
4. Add your OpenAI API key as an environment variable

## 🎯 Usage

1. **Set up accounts**: Add your bank accounts and credit cards
2. **Add transactions**: Record your income and expenses
3. **Set goals**: Define financial goals you want to achieve
4. **Track recurring expenses**: Add subscriptions and regular bills
5. **Get AI insights**: Click "Get Coach Insights" for personalized advice

## 📸 Screenshots

*Add screenshots of your application here*

## 🔒 Security

- API keys are stored in environment variables
- CORS configured for production
- Database credentials managed by hosting platform
- No sensitive data in version control

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-profile)
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Render for hosting
- React and FastAPI communities

---

