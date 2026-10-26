# Build stage: Java 22 and Maven
FROM maven:3.9-eclipse-temurin-22 AS build

WORKDIR /app

# Copy the complete Maven multi-module project
COPY . .

# Make Maven Wrapper executable and build the application
RUN chmod +x mvnw \
  && ./mvnw -B package

# Runtime stage: Java 17 only
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the executable Spring Boot JAR
COPY --from=build /app/backend/target/SongBook-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 3000

ENTRYPOINT ["java", "-jar", "app.jar"]
