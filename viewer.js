async function fetchJSON(path){
  const headers = API_TOKEN ? { 'Authorization': 'Bearer ' + API_TOKEN } : {};
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if(!res.ok) throw new Error('Failed ' + path);
  return res.json();
}

function fmtDate(d){ const dt = new Date(d); return dt.toISOString().split('T')[0]; }

async function main(){
  document.getElementById('openDrive').href = 'https://onedrive.live.com/'; // adjust if needed
  const kpi = await fetchJSON('/webhook/kpi/summary').catch(_=>null);
  const rep = await fetchJSON('/webhook/reports/list').catch(_=>null);

  const now = new Date().toLocaleString('ar-SA');
  document.getElementById('updatedAt').textContent = 'آخر تحديث: ' + now;

  // KPIs
  if(kpi){
    const days = kpi.days || [];
    const projects = kpi.projects || [];
    const prog = kpi.progress || []; // array of {date, average, series: {project: value}}
    const qty  = kpi.quantity || []; // array of {date, total}

    // Top cards
    document.getElementById('activeProjects').textContent = projects.length + ' projects';
    const todayProg = prog.length ? prog[prog.length-1].average : 0;
    document.getElementById('progressToday').textContent = (todayProg ?? 0).toFixed(1) + ' %';
    const todayQty = qty.length ? qty[qty.length-1].total : 0;
    document.getElementById('qtyToday').textContent = todayQty ?? 0;
    document.getElementById('uomToday').textContent = kpi.uom || '';

    // teams active (approx from daily_logs)
    document.getElementById('teamsActive').textContent = kpi.teamsActiveToday ?? '--';

    // Charts
    const ctxP = document.getElementById('chartProgress').getContext('2d');
    const labels = prog.map(r=>r.date);
    const datasets = [{ label:'Average', data: prog.map(r=>r.average) }];
    // optionally add per-project series if included
    if(prog.length && prog[0].series){
      const keys = Object.keys(prog[0].series);
      for(const k of keys){
        datasets.push({ label: k, data: prog.map(r=>r.series[k] ?? null) });
      }
    }
    new Chart(ctxP, { type:'line', data:{ labels, datasets }, options:{ responsive:true, scales:{ y:{ beginAtZero:true, max:100 }}}});

    const ctxQ = document.getElementById('chartQty').getContext('2d');
    new Chart(ctxQ, { type:'bar', data:{ labels: qty.map(r=>r.date), datasets:[{ label:'Total Qty', data: qty.map(r=>r.total) }] }, options:{ responsive:true, scales:{ y:{ beginAtZero:true }}} });
  }

  // Reports
  if(rep){
    const tbody = document.querySelector('#tblReports tbody');
    tbody.innerHTML = '';
    for(const r of rep.items || []){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.date}</td><td>${r.project}</td><td><a target="_blank" href="${r.url}">فتح</a></td>`;
      tbody.appendChild(tr);
    }
  }
}

main();
