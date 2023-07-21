# Comandos Importantes

## Sincronizar cambios en GitHub

### Traer cambios desde desde main a nuestra rama

- Asegurar que estamos en nuestra rama

  ```txt
  git branch
  ```

- En caso de que no estamos en nuestra rama, cambiamos a la que nos pertenece

  ```txt
  git checkout <name>
  ```

- Hacer fetch de los cambios que existen en la rama `main`

  ```txt
  git fetch origin main
  ```

- Aplicar los cambios de `main` en nuestra rama

  ```txt
  git merge origin/main
  ```

- Publicar los cambios

  ```txt
  git push -u origin <rama de trabajo>
  ```

### ADMIN: Sincronizar cambios globales en main

> NOTA: Este apartado se debe aplicar solo en caso de estar seguro de que los cambios funcionan correctamente

- Asegurar que estamos en la rama `main` en donde publicaremos los cambios de todos y mantendremos actualizado el proyecto "oficial"

  ```txt
  git branch
  ```

- En caso de que no estamos en la rama `main`, cambiamos a la misma

  ```txt
  git checkout main
  ```

- Hacer fetch de los cambios que existen en la rama en la que estamos desarrollando (`carlos-dev`, `SergioG`, `JairoG`)

  ```txt
  git fetch origin <rama de trabajo>
  ```

- Subir los cambios a la rama `main`

  ```txt
  git merge origin/<rama de trabajo>
  ```

- Publicar los cambios conjuntos

  ```txt
  git push -u origin main
  ```

## Paquetes instalados

```txt
$: npm i bcrypt class-validator class-transformer joi passport-jwt pg passport typeorm typeorm-naming-strategies uuid @nestjs/config @nestjs/passport @nestjs/typeorm @nestjs/swagger @nestjs/jwt @nestjs/mapped-types@* @types/passport-jwt
```

## Generar modulos, controladores, servicios

- En la entidad de usuario

```txt
nest g mo usuarios
nest g co usuarios/controllers/usuarios --flat
nest g s usuarios/servicios/usuarios --flat

```

- En Auth

```txt
nest g mo auth
nest g co auth/controllers/auth --flat
nest g s auth/services/auth --flat

```

## Generar un recurso de CRUD

```txt
 nest g res archivos
 nest g res notificaciones
 nest g res archivos
 nest g res proyectos
 nest g res solicitudes
```
