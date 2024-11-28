package routes

import (
	"server-management/handlers"
	"server-management/logger"
	"server-management/middlewares"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const port = ":8080"

func StartServer() error {
	router := SetupRouter()
	err := router.Run(port)
	return err
}

func SetupRouter() *gin.Engine {
	router := gin.New()
	router.SetTrustedProxies(nil)
	// Custom logger middleware to log all requests to the console and the file with zap logger
	router.Use(middlewares.ZapLoggerMiddleware())
	router.Use(gin.Recovery())

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// for swagger api documentation group
	//docs.SwaggerInfo.BasePath = "/api/v1"
	// Swagger Route for connect to swagger ui go to http://127.0.0.1:8080/swagger/index.html
	//router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	// Public routes without middleware
	router.POST("/api/v1/login", handlers.Login)
	// Ping Route
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
		logger.Logger().Info("pong")
	})

	v1 := router.Group("/api/v1")
	v1.Use(middlewares.ValidateToken()) // Only apply ValidateToken middleware to the routes inside this group
	{
		// Auth Routes
		v1.POST("/register", handlers.Register)
		v1.POST("/logout", handlers.Logout)
		v1.GET("/users", handlers.Users)
		v1.DELETE("/delete-user/:user_id", handlers.DeleteUser)
		v1.PUT("/update-user-role", handlers.UpdateUserRole)
		v1.GET("/servers", handlers.Servers)
		v1.POST("/add-server", handlers.AddServer)
		v1.DELETE("/delete-server/:server_id", handlers.DeleteServer)
		v1.POST("/forgot-password", handlers.ForgotPasswordHandler)
		v1.POST("/reset-password", handlers.ResetPasswordHandler)
	}

	return router
}
