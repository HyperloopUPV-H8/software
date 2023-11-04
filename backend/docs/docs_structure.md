Cada punto es una carpeta y cada subpunto es un archivo. Cada archivo debe explicar su concepto de la manera más directa.
La intro de cada sección será similar a los intros de los apartadas de The Rust book: uno o dos párrafos que resumen el concepto que engloba lo que se va a explicar y porque es necesario para el backend.
Cada documento puede contener extractos de código a modo de ejemplo.

1. Introducción
    1. Intro + Funciones fundamentales de la estación de control.
    2. Guía de instalación + simular el back
2. BBDD
    1. Intro
    2. Estructura de ADE
    3. Descarga del excel con la API de Google
    4. Construcción de pod_data en varios pasos
    5. Detección de errores
3. Pod comm.
    1. Intro
    2. Setup Switch + Raspi y sniffado
    3. TCP: keepalives
4. Decoding
    1. Intro
    2. Modelos pod_data
    3. Discriminación de datos: vehicle.Listen()
    4. Funcionamiento del desparseo (mapas de decoders)
5. Enconding
    1. Ordenes
6. Protections
7. Data logging
    1. Intro
    2. Interfaz Loggable
    3. Posibilidad de usar ctx para coordinar los diferentes loggers.
    4. Loggeo redundante en el vehículo.
8. Front comm.
    1. Structs JSON
    2. Throttling
    3. Media movil
    4. Ws_handle: suscripción a temas.
9. Extras
    1. Tracing
    2. Patron de observables
    3. Configuración con TOML
    4. BLCU
    5. Multiples servers
10. Ideas para el año siguiente
