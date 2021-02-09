# Proyecto curso: Budget Tracker

 - Se desarrolla API para manejar presupuestos por periodos. Estos tienen un conjunto de categorías a las cuales se les asigna un % del presupuesto total.

 - La API recibe como entradas transacciones por categría, las cuales se ascoian a un presupuesto.

 - Se desarrolla un sistema de usuarios con roles, lo cual define que paramatros pueden ingresar en la API con respecto a la definición y modificación de presupuestos.

## Iniciar API
- Para inicializar el proyecto basta con  correr los comandos:
```
npm install

npm start
```

## Documentación

- Para ver con mayor detalle que hace cada consulta, revisar documentación definida en Postman:

```
https://documenter.getpostman.com/view/14495862/TW76Cj6e
```


- También se monta documentación utilizando Swagger. Esta se puede acceder cuando se inicia la aplicación en la url:
    
```
localhost:5000/api-docs
```

- Para acceder a las consultas en Postman primero es necesario ejecutar la consulta de 'login' y luego copiar y pegar el token en el campo 'Authorization' definido para toda la colección:

```
<token>
```

- De igual forma para acceder a las consultas en Swagger, es neceario copiar y pegar el token en el campo 'Authorization' de la UI. En este caso, a diferencia de en Postman, se requiere escribir el token de la siguiente forma (agregando la palabra Bearer al principio):

```
Bearer <token>
```