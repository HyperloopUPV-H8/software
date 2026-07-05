# FIXES APLICADOS - Versión 1.2

## Problema Reportado
- Gráficos no se renderizan a pantalla completa
- Se cortan/truncan visualmente
- Bugs al crear señales con multiplicación

## Soluciones Aplicadas

### 1. CSS - Forzar Ancho Completo
**Archivo**: `style.css` línea ~417
```css
.plot-container {
    width: 100% !important; /* Forzar ancho completo */
}
```

### 2. JavaScript - Resize Inmediato
**Archivo**: `app.js` línea ~607
Ahora después de crear el plot, se fuerza un resize inmediatamente:
```javascript
Plotly.newPlot(container, traces, layout, config).then(() => {
    // Forzar resize inmediato para garantizar ancho completo
    Plotly.Plots.resize(container);
});
```

### 3. Estado Inicial - Sidebar Colapsado
**Archivos**: `app.js` línea 8, `index.html` línea 16
- La app arranca con el menú cerrado
- Los gráficos tienen todo el espacio desde el inicio

### 4. Fix Operaciones
**Archivo**: `app.js` línea 281
- Se agregó `updateOperationSelects()` después de crear señales
- Esto refresca los dropdowns para evitar estados inconsistentes

## INSTRUCCIONES PARA EL USUARIO

1. **Cierra TODAS las pestañas** del navegador que tengan la app abierta
2. **Abre el navegador de nuevo** (inicio limpio)
3. **Navega a**: `file:///c:/Users/Mutti/Downloads/plot_gui_web/index.html`
4. La app debería arrancar con:
   - Menú cerrado (solo botón visible arriba izquierda)
   - Área de plots a pantalla completa
   - Sin gráficos cortados

## Si Aún Hay Problemas

Si después de seguir los pasos anteriores TODAVÍA ves gráficos cortados:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Escribe: `Plotly.Plots.resize(document.getElementById('plot_0'))`
4. Pulsa Enter
5. El gráfico debería ajustarse instantáneamente

## Modo de Uso Recomendado

1. **Abrir app** → Menú cerrado, pantalla completa
2. **Click en botón (≡)** → Abre menú temporal
3. **Cargar CSVs** → Arrastra carpetas/archivos
4. **Crear señales** → Click "Create Calculated Signal"
5. **Añadir plots** → Click "Add New Plot"
6. **Asignar señales** → Dropdown "+ Add signal..."
7. **Cerrar menú** → Click en (≡) para volver a pantalla completa
8. **Disfrutar** → Gráficos a máxima resolución

---
**Versión**: 1.2
**Fecha**: 2025-12-28
