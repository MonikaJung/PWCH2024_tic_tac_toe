FROM maven:3.8.4-jdk-11 AS builder
WORKDIR /app
COPY . .
RUN mvn -f /app/pom.xml clean package -DskipTests

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=builder /app/target/your-application-name.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]