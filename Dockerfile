# Build stage: Java 22 and Maven
FROM maven:3.9-eclipse-temurin-22 AS build

WORKDIR /app

COPY . .

# Avoid MAVEN_CONFIG being interpreted as a Maven argument
RUN chmod +x mvnw \
    && unset MAVEN_CONFIG \
    && ./mvnw -B package

# Runtime stage: Java 22
FROM eclipse-temurin:22-jre

WORKDIR /app

COPY --from=build /app/backend/target/SongBook-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 3000

ENTRYPOINT ["java", "-jar", "app.jar"]
