const fs = require('fs');

const pricingLabTranslations = {
  en: {
    title: 'Supply & Demand Lab',
    subtitle: 'Find the best price to maximize your sales and profits!',
    selling_price: 'Selling Price',
    customers: 'Customers',
    cost_per_unit: 'Cost/Unit',
    test_price: 'Test This Price',
    optimal_found: 'Optimal Price Found!',
    turns_remaining: 'turns remaining',
    profit_curve: 'Profit & Growth Curve',
    goal: 'Max Goal',
    run_test: 'Try a price and click "Test This Price" to view profits!',
    profit_label: 'Profit',
  },
  es: {
    title: 'Laboratorio de Oferta y Demanda',
    subtitle: '¡Encuentra el precio ideal para maximizar tus ventas y ganancias!',
    selling_price: 'Precio de Venta',
    customers: 'Clientes',
    cost_per_unit: 'Costo/Unidad',
    test_price: 'Probar este precio',
    optimal_found: '¡Precio óptimo encontrado!',
    turns_remaining: 'intentos restantes',
    profit_curve: 'Curva de Beneficios y Crecimiento',
    goal: 'Meta Máxima',
    run_test: '¡Prueba un precio y haz clic en "Probar este precio" para ver los beneficios!',
    profit_label: 'Beneficio',
  },
  fr: {
    title: 'Laboratoire Offre et Demande',
    subtitle: 'Trouvez le prix idéal pour maximiser vos ventes et vos bénéfices !',
    selling_price: 'Prix de Vente',
    customers: 'Clients',
    cost_per_unit: 'Coût/Unité',
    test_price: 'Tester ce prix',
    optimal_found: 'Prix optimal trouvé !',
    turns_remaining: 'tentatives restantes',
    profit_curve: 'Courbe des Profits et Croissance',
    goal: 'Objectif Maximum',
    run_test: 'Testez un prix et cliquez sur "Tester ce prix" pour voir les profits !',
    profit_label: 'Profit',
  },
  de: {
    title: 'Labor für Angebot und Nachfrage',
    subtitle: 'Finde den besten Preis, um Verkäufe und Gewinne zu maximieren!',
    selling_price: 'Verkaufspreis',
    customers: 'Kunden',
    cost_per_unit: 'Kosten/Einheit',
    test_price: 'Diesen Preis testen',
    optimal_found: 'Optimaler Preis gefunden!',
    turns_remaining: 'verbleibende Versuche',
    profit_curve: 'Gewinn- & Wachstumskurve',
    goal: 'Höchstziel',
    run_test: 'Probiere einen Preis aus und klicke auf "Diesen Preis testen", um Gewinne zu sehen!',
    profit_label: 'Gewinn',
  }
};

['en', 'es', 'fr', 'de'].forEach(lang => {
  const filePath = `src/locales/${lang}.ts`;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('pricing_lab')) {
    console.log(`${filePath} already has pricing_lab`);
    return;
  }
  
  // Find "games: {" or '"games": {'
  const target = content.includes('      districts: {') ? '      districts: {' : '    "districts": {';
  const replacement = `      pricing_lab: ${JSON.stringify(pricingLabTranslations[lang], null, 6).trim()},\n${target}`;
  
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added pricing_lab to ${filePath}`);
  } else {
    console.warn(`Could not find target in ${filePath}`);
  }
});

