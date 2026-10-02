"""
Government Schemes & Jan Aushadhi Medicine Price Optimizer
Empowers rural families to save 70%-85% on healthcare expenses
"""

import json
import os
from typing import List, Dict, Any, Optional

class SchemesOptimizer:
    def __init__(self, data_file: str = "data/generic_medicines.json"):
        self.medicines: List[Dict[str, Any]] = []
        self.schemes: List[Dict[str, Any]] = []
        if os.path.exists(data_file):
            with open(data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.medicines = data.get("medicines", [])
                self.schemes = data.get("government_schemes", [])

    def search_medicines(self, query: Optional[str] = None) -> List[Dict[str, Any]]:
        """Searches generic medicines and price comparison table."""
        if not query:
            return self.medicines
        q = query.lower()
        q_tokens = [tok for tok in q.replace('/', ' ').replace(',', ' ').replace('+', ' ').split() if len(tok) >= 3]
        results = []
        for m in self.medicines:
            g_name = m.get("generic_name", "").lower()
            b_name = m.get("branded_name", "").lower()
            d_cat = m.get("disease_category", "").lower()
            
            # Check full query match or inverse match
            if (q in g_name or q in b_name or q in d_cat or
                g_name in q or b_name in q):
                results.append(m)
                continue
            
            # Check individual tokens (e.g. 'combiflam', 'paracetamol', 'acidity', 'kidney')
            if any(tok in g_name or tok in b_name or tok in d_cat for tok in q_tokens):
                results.append(m)
        return results

    def calculate_total_savings(self, selected_indices: List[int]) -> Dict[str, Any]:
        """Calculates total money saved by choosing Jan Aushadhi generic medicines."""
        branded_total = 0.0
        generic_total = 0.0
        for idx in selected_indices:
            if 0 <= idx < len(self.medicines):
                m = self.medicines[idx]
                branded_total += m.get("branded_price_rs", 0.0)
                generic_total += m.get("jan_aushadhi_price_rs", 0.0)
                
        savings_rs = max(branded_total - generic_total, 0.0)
        savings_pct = (savings_rs / branded_total * 100.0) if branded_total > 0 else 0.0
        
        return {
            "branded_total_rs": round(branded_total, 2),
            "generic_total_rs": round(generic_total, 2),
            "savings_rs": round(savings_rs, 2),
            "savings_percentage": f"{round(savings_pct, 1)}%"
        }
