# Whereby Embedded API example

## Introduction

This is an example of implementing the Whereby Embedded Meetings API using Java and Spring Boot. This is not
production-ready code and Whereby takes no responsibility for its use, please see the disclaimer in the parent repo.

## Getting started

Add your api key to [application.yml](./src/main/resources/application.yml).

### Run in development mode (default port 9090):

```bash
$ ./gradlew bootRun
```

### Build and test:

```bash
$ ./gradlew build
```

### Run in Docker:

```bash
$ docker run --rm -it $(docker build -q .)
```

## Spring boot references

### Reference Documentation

For further reference, please consider the following sections:

* [Official Gradle documentation](https://docs.gradle.org)
* [Spring Boot Gradle Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/2.5.2/gradle-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/2.5.2/gradle-plugin/reference/html/#build-image)
* [Spring Web](https://docs.spring.io/spring-boot/docs/2.5.2/reference/htmlsingle/#boot-features-developing-web-applications)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/2.5.2/reference/htmlsingle/#using-boot-devtools)

### Guides

The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/bookmarks/)

### Additional Links

These additional references should also help you:

* [Gradle Build Scans – insights for your project's build](https://scans.gradle.com#gradle)

