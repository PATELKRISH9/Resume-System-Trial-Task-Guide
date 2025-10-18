# Resume-System-Trial-Task-Guide
# Clone the repository
git clone https://github.com/<your-username>/ResumeSystem.git
cd ResumeSystem

# Install dependencies
cd server && npm install
cd ../client && npm install

# Environment variables
# Inside server/.env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=8080

# Run backend
cd server
npm start

# Run frontend
cd ../client
npm start
