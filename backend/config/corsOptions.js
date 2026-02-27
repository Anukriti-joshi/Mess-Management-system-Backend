import allowedOrigins from "./allowedOrigins.js";

export const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
