import cors from "cors";

const corsOptions: cors.CorsOptions = {

  origin: "*",

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  credentials: true, 

  allowedHeaders: ["Content-Type", "Authorization"], 

  
};

export default corsOptions;
