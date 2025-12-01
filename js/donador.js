// donador.js
function logout() {
  // borrar cualquier información de sesión del donante si lo deseas
  // localStorage.removeItem('bocaditos_donor_profile');
  alert("Sesión cerrada");
  window.location.href = "login.html";
}

// Opcionalmente, exponer una función para cargar datos de donantes (se mantiene aquí para posible reutilización)
function getDonorProfile(){
  try{ return JSON.parse(localStorage.getItem('bocaditos_donor_profile')||'null'); }catch(e){ return null; }
}

/* ---------- Historial de donaciones (localStorage) ---------- */
function loadDonations(){
  try{ return JSON.parse(localStorage.getItem('bocaditos_donor_donations') || '[]'); }catch(e){ return []; }
}
function saveDonations(arr){ try{ localStorage.setItem('bocaditos_donor_donations', JSON.stringify(arr)); }catch(e){} }

function escapeHtml(s){ if (s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function formatDate(ts){ try{ var d = new Date(Number(ts)); return d.toLocaleString(); }catch(e){ return ''; } }

function renderDonations(){
  var container = document.getElementById('donationHistory');
  if (!container) return;
  var arr = loadDonations() || [];
  container.innerHTML = '';
  if (arr.length === 0){ container.innerHTML = '<div class="history-empty">No hay donaciones registradas aún.</div>'; return; }

  // Render as table for wide screens, but keep flexible
  var table = document.createElement('table');
  var thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Destino</th></tr>';
  table.appendChild(thead);
  var tbody = document.createElement('tbody');

  arr.slice().reverse().forEach(function(item){
    var data = item.data || {};
    var tr = document.createElement('tr');
    var fecha = formatDate(item.ts || Date.now());
    var nombre = data.nombre_de_producto || data['nombre de producto'] || data.nombre || '-';
    var tipo = data.tipo_de_producto || data['tipo de producto'] || data.tipo || '-';
    var cantidad = data.cantidad || '-';
    var destino = data.destino || data.Destino || '-';
    tr.innerHTML = '<td>'+escapeHtml(fecha)+'</td><td>'+escapeHtml(nombre)+'</td><td>'+escapeHtml(tipo)+'</td><td>'+escapeHtml(cantidad)+'</td><td>'+escapeHtml(destino)+'</td>';
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

function clearDonations(){ if (!confirm('¿Limpiar historial de donaciones?')) return; try{ localStorage.removeItem('bocaditos_donor_donations'); }catch(e){} renderDonations(); }

// inicializar botones y render al cargar
document.addEventListener('DOMContentLoaded', function(){
  try{ renderDonations(); var clearBtn = document.getElementById('clearDonations'); if (clearBtn) clearBtn.addEventListener('click', clearDonations); window.addEventListener('storage', function(e){ if (e.key === 'bocaditos_donor_donations') renderDonations(); }); }catch(e){ console.error(e); }
});