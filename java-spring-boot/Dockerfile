FROM openjdk:17.0.1-buster

VOLUME /tmp
ADD build/libs/*.jar /opt/whereby/app.jar
ENV JAVA_OPTS="-server -Xms256m -Xmx256m -Xmn128m -XX:+UseG1GC"
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /opt/whereby/app.jar" ]
