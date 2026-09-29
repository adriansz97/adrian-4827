# Snail GP

Panel full-stack para consultar una jornada simulada de carreras de caracoles y administrar un saldo local mediante la pasarela ficticia SnailPay.

## Funcionalidades

- Registro local con validación de nombre, correo y contraseña.
- Contraseñas protegidas con `bcryptjs` y un factor de costo de 12 rondas.
- Inicio y cierre de sesión.
- Acceso protegido al dashboard.
- Persistencia del perfil, sesión, saldo e intentos de recarga en `localStorage`.
- Dashboard responsive con resultados simulados de apuestas y carreras.
- Gráfica donut de apuestas ganadas y perdidas.
- Gráfica de barras con las victorias de seis caracoles.
- Recargas ficticias aprobadas, rechazadas, con error interno o timeout.
- Pruebas automatizadas para los flujos principales.

## Tecnologías

- React, Vite y TypeScript.
- Express y TypeScript.
- Tailwind CSS.
- Componentes base de shadcn/ui.
- React Hook Form y Zod.
- Chart.js mediante `react-chartjs-2`.
- `bcryptjs`.
- Vitest, Testing Library y Supertest.

La interfaz utiliza componentes básicos de shadcn/ui para comportamiento y accesibilidad. La composición del dashboard, el sistema visual, las gráficas y la adaptación responsive fueron construidos específicamente para Snail GP con Tailwind CSS.

## Requisitos

- Node.js 20.19 o superior.
- npm 10 o superior.

## Instalación

Desde la raíz del repositorio:

```bash
npm install
```

## Ejecución

Inicia el frontend y la API con:

```bash
npm run dev
```

Servicios disponibles:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`
- Estado de la API: `GET http://localhost:3001/api/health`

Los valores predeterminados permiten ejecutar la aplicación sin configurar variables de entorno.

## Variables de entorno

| Variable                    | Servicio | Valor predeterminado    |
| --------------------------- | -------- | ----------------------- |
| `PORT`                      | API      | `3001`                  |
| `WEB_ORIGIN`                | API      | `http://localhost:5173` |
| `SNAILPAY_TIMEOUT_DELAY_MS` | API      | `5500`                  |
| `VITE_API_URL`              | Frontend | `http://localhost:3001` |

Para cambiar una variable de la API, puede proporcionarse al ejecutar el proyecto:

```bash
WEB_ORIGIN=http://localhost:5174 npm run dev
```

## Comandos de calidad

```bash
npm test
npm run build
npm run lint
npm run format:check
```

`npm test` ejecuta las pruebas del frontend, la API y los contratos compartidos. Actualmente se incluyen 11 pruebas automatizadas.

## Escenarios de SnailPay

Todos los datos utilizados deben ser ficticios. El nombre debe contener algún valor y el monto debe ser mayor que cero, con un máximo de `$100,000`.

| Resultado         | Tarjeta            | Vencimiento | CVV   |                       HTTP |
| ----------------- | ------------------ | ----------- | ----- | -------------------------: |
| Aprobado          | `1234123412341234` | `12/26`     | `543` |                      `201` |
| Tarjeta rechazada | `4000000000000002` | `12/26`     | `543` |                      `422` |
| Error del sistema | `5000000000000000` | `12/26`     | `543` |                      `503` |
| Timeout           | `4080000000000000` | `12/26`     | `543` | `504` después de la demora |

El frontend cancela el escenario de timeout después de 3.5 segundos y no aplica la recarga. Cualquier otro número válido de 16 dígitos produce el rechazo `payment_data_mismatch`.

El formulario incluye botones para completar rápidamente cada escenario.

## Endpoint de SnailPay

```text
POST /api/snailpay/charges
```

El cuerpo de la solicitud contiene:

- `card_number`
- `expiration_date`
- `cvv`
- `full_name`
- `transaction_amount`
- `payer_id`
- `payer_email`

Las respuestas controladas contienen:

- `id`
- `status`
- `status_detail`
- `transaction_amount`
- `date_created`
- `authorization_code`
- `reference`
- `payer_id`
- `payer_email`
- `card_number`
- `cvv`

El saldo solo se actualiza cuando la respuesta tiene el estado `approved`.

## Organización

```text
apps/
  api/        API de Express y simulación de SnailPay
  web/        Aplicación React
packages/
  contracts/  Esquemas Zod y tipos compartidos
```

El frontend está organizado por funcionalidades: autenticación, dashboard y pagos. Los contratos compartidos evitan diferencias entre los datos enviados por React y las respuestas generadas por Express.

## Persistencia local

La aplicación administra un usuario por navegador mediante claves versionadas:

- `snail-gp:user:v1`
- `snail-gp:session:v1`
- `snail-gp:payment-attempts:v1`

El saldo se conserva en el usuario almacenado y solo cambia después de una recarga aprobada.

## Consideraciones de seguridad

Snail GP es una simulación local. La contraseña se protege con `bcryptjs`, pero una autenticación basada únicamente en `localStorage` no sustituye un backend real.

La tarjeta y el CVV se incluyen en las respuestas y se guardan localmente como parte del contrato de la simulación. En una aplicación real, el CVV nunca debería almacenarse, la tarjeta se tokenizaría mediante un proveedor certificado y el saldo se actualizaría desde el backend mediante una transacción de base de datos.
