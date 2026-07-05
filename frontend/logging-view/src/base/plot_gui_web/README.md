# CSV Plot Studio - LaTeX Quality Web App

## ✅ Funcionalidades Completadas

### 📁 Gestión de Archivos
- ✅ **Carga de carpetas completas** - Click normal abre selector de carpetas
- ✅ **Carga de archivos individuales** - Shift+Click para seleccionar archivos
- ✅ **Drag & drop** - Arrastra carpetas o archivos directamente
- ✅ **Auto-detección** - Solo procesa archivos .csv
- ✅ **Normalización de tiempo** - Tiempo empieza en 0ms (mantiene millisegundos originales)

### 🧮 Operaciones Matemáticas (GODLIKE Feature)
- ✅ **Señales calculadas** - error = referencia - medida
- ✅ **Operaciones disponibles**: Resta, Suma, Multiplicación, División
- ✅ **Interpolación lineal** - Las señales se sincronizan automáticamente
- ✅ **Resolución**: 1ms para máxima precisión

### 📊 Plots de Calidad LaTeX
- ✅ **Fondo BLANCO** - Listo para TFG/publicaciones académicas
- ✅ **Tipografía serif** - Computer Modern / Times New Roman
- ✅ **Ejes profesionales** - Mirror ticks, gridlines sutiles
- ✅ **Líneas gruesas** (2.5px) - Máxima visibilidad
- ✅ **Timestamps en millisegundos** - Sin conversión a segundos

### 🎨 Interfaz Premium
- ✅ **Sidebar colapsable** - Botón toggle (≡) para ocultar/mostrar
- ✅ **Múltiples plots** - Añade tantos como necesites
- ✅ **Asignación flexible** - Cada archivo puede ir a cualquier plot
-  **Dark mode moderno** - Para trabajar sin cansar la vista
- ✅ **Animaciones suaves** - Transiciones profesionales

### 📤 Exportación de Alta Calidad
- ✅ **SVG (Vector)** - 1200x800px, perfecto para LaTeX
- ✅ **PNG (High-Res)** - 2400x1600px @ 2x scale para impresión
- ✅ **Doble botón** - Un botón para cada formato

### 🔧 Redimensionamiento Manual
- ✅ **Drag handle** - Arrastra desde la base de cada plot
- ✅ **Altura ajustable** - Mínimo 300px, sin máximo
- ✅ **Responsive** - Plotly se redibuja automáticamente

## 🚀 Cómo Usar

### 1. Abrir la App
- Doble click en `index.html`
- Se abre en tu navegador (funciona offline, sin servidor)

### 2. Cargar Datos
- **Carpeta**: Click en zona de carga → selecciona carpeta
- **Archivos**: Shift+Click → selecciona archivos
- **Arraстrar**: Drag & drop desde el explorador

### 3. Crear Señal de Error (opcional)
1. Click "Create Calculated Signal"
2. Nombre: "Position Error"
3. Operación: Subtraction (A - B)
4. Signal A: `reference_distance.csv`
5. Signal B: `airgap_distance.csv`
6. Click "Create"

### 4. Añadir Plots
1. Click "Add New Plot"
2. En el sidebar, despliega "+ Add signal..."
3. Selecciona archivos o señales calculadas
4. Repite para más plots

### 5. Ajustar Tamaño
- Arrastra el handle (▬) en la parte inferior de cada plot
- O usa los controles de zoom de Plotly

### 6. Exportar
- **Icono documento**: SVG (para LaTeX, \includegraphics{plot.svg})
- **Icono descarga**: PNG de alta resolución

## 📝 Notas Técnicas

### Tiempo en Millisegundos
Los timestamps se mantienen en millisegundos tal como vienen en el CSV:
```
1766854947899 → normalizado a → 0 ms
1766854947910 → normalizado a → 11 ms
```

### Formato de los CSVs
Esperado:
```
timestamp,LCU,backend,value
1766854947899,LCU,backend,24.404621
```
- Columna 1: Timestamp (ms)
- Columna 4: Valor a plotear

### Calidad LaTeX
Los plots usan:
- Serif fonts (Computer Modern priori dad)
- Fondo blanco
- Ejes con mirror ticks
- Grid sutil (#e0e0e0)
- Líneas negras en ejes
- Exportación SVG vectorial (escalable)

##  Atajos del Teclado
- **Click**: Seleccionar carpeta
- **Shift+Click**: Seleccionar archivos individuales
- **Drag & Drop**: Carpetas o archivos

## 🎯 Para tu TFG
1. **Exporta en SVG** - Calidad vectorial infinita
2. **En LaTeX**:
   ```latex
   \begin{figure}[htbp]
       \centering
       \includesvg[width=0.8\textwidth]{plot_12345.svg}
       \caption{Respuesta del sistema ADRC}
       \label{fig:adrc_response}
   \end{figure}
   ```
3. **O usa PNG** si el journal/universidad no soporta SVG

## Estructura de Archivos
```
plot_gui_web/
├── index.html          # Interfaz principal
├── style.css           # Estilos premium
├── app.js              # Lógica de la aplicación
└── README_FINAL_STEPS.txt  # Pasos finales (si hace falta)
```

---

**Creado especialmente para tu TFG con amor y calidad LaTeX 🎓✨**
