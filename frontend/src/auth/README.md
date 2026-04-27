# Autenticación — Amazon Cognito

Esta carpeta contiene la lógica de autenticación de la aplicación usando **Amazon Cognito** y la librería `amazon-cognito-identity-js`.

## Archivos

### `cognitoConfig.js`
Configuración de la conexión con el User Pool de Cognito.

```js
{
  region: 'eu-north-1',
  userPoolId: 'eu-north-1_sY2obhHwM',
  clientId: '7023418n9u57feofvs3dsfsth1'
}
```

Este archivo centraliza los IDs de Cognito para que el resto de la app no tenga que repetirlos.

---

### `AuthContext.js`
Contexto de React que expone el estado de autenticación a toda la aplicación.

#### Funciona así:
1. Al cargar la app, comprueba si ya existe una sesión activa en Cognito.
2. Si la sesión es válida, restaura el usuario automáticamente sin necesidad de volver a hacer login.
3. Expone las funciones `login`, `logout` y el objeto `user` a todos los componentes vía contexto.
4. Cierra sesión automáticamente tras 5 minutos de inactividad.

#### Comportamiento del login:
- Usa `AuthenticationDetails` y `CognitoUser` de `amazon-cognito-identity-js`.
- Si Cognito devuelve `newPasswordRequired`, la promesa se rechaza con un objeto especial que incluye `userAttributes` y `cognitoUser`.
- En caso de éxito, guarda el usuario autenticado en el estado global y devuelve la sesión.

#### Comportamiento del logout:
- Cierra la sesión en Cognito.
- Limpia el estado local del usuario.
- Redirige a `/`.

#### Valores que expone el contexto:

| Valor | Tipo | Descripción |
|---|---|---|
| `user` | `CognitoUser \| null` | Usuario autenticado, o `null` si no hay sesión |
| `loading` | `boolean` | `true` mientras se comprueba la sesión al inicio |
| `login(email, password)` | `Promise` | Inicia sesión. Resuelve con la sesión o rechaza con el error |
| `logout()` | `function` | Cierra sesión y limpia el estado |

#### Tiempo de inactividad
- `5 * 60 * 1000` ms.
- Eventos que reinician el temporizador: `mousemove`, `mousedown`, `keydown`, `scroll` y `touchstart`.

#### Uso en un componente:
```js
import { useAuth } from '../auth/AuthContext';

function MiComponente() {
    const { user, login, logout } = useAuth();

    // Obtener email del usuario
    user.getUserAttributes((err, attrs) => {
        const email = attrs.find(a => a.Name === 'email')?.Value;
    });
}
```

#### Protección de rutas en `App.js`:
```js
import { AuthProvider } from './auth/AuthContext';

// Envolver la app con AuthProvider
<AuthProvider>
  <App />
</AuthProvider>
```

Las rutas privadas comprueban `user !== null` y redirigen a `/login` si no hay sesión activa.

## Librería utilizada
- [`amazon-cognito-identity-js`](https://www.npmjs.com/package/amazon-cognito-identity-js)

## Configuración Cognito
- Región: `eu-north-1`
- User Pool ID: `eu-north-1_sY2obhHwM`
- Client ID: `7023418n9u57feofvs3dsfsth1`

## Región
- `eu-north-1` (Estocolmo)