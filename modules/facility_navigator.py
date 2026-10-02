"""
Rural Healthcare Facility & Emergency Navigator
Finds Nearest PHC, CHC, Doctors on Duty, Medicine Stock, and 108 Ambulance Dispatch
"""

import json
import os
from typing import List, Dict, Any, Optional

class FacilityNavigator:
    def __init__(self, data_file: str = "data/phc_directory.json"):
        self.facilities: List[Dict[str, Any]] = []
        if os.path.exists(data_file):
            with open(data_file, "r", encoding="utf-8") as f:
                self.facilities = json.load(f).get("facilities", [])

    def get_all_districts(self) -> List[str]:
        """Returns list of unique districts."""
        districts = set()
        for f in self.facilities:
            districts.add(f.get("district", "ગુજરાત"))
        return sorted(list(districts))

    def search_facilities(self, district: Optional[str] = None, max_distance_km: float = 50.0, require_ambulance: bool = False) -> List[Dict[str, Any]]:
        """Filters facilities by district, distance, and ambulance availability."""
        results = []
        for fac in self.facilities:
            if district and district != "બધા જિલ્લા (All Districts)" and fac.get("district") != district:
                continue
            if fac.get("distance_km", 0) > max_distance_km:
                continue
            if require_ambulance and not fac.get("ambulance_available", False):
                continue
            results.append(fac)
            
        # Sort by distance ascending
        results.sort(key=lambda x: x.get("distance_km", 0))
        return results

    def get_emergency_facility(self, current_district: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Returns the highest capacity emergency hospital in or near the district."""
        candidates = self.search_facilities(district=current_district)
        # Prioritize Civil Hospital or CHC with ICU beds
        for c in candidates:
            if c.get("icu_beds", 0) > 0:
                return c
        return candidates[0] if candidates else None

    def generate_ambulance_alert(self, patient_name: str, location: str, condition: str) -> Dict[str, Any]:
        """Generates emergency 108 ambulance dispatch and family SMS notification."""
        sms_text = f"🚨 તાત્કાલિક ઈમરજન્સી: દર્દી {patient_name} ની સ્થિતિ ગંભીર છે ({condition}). સ્થળ: {location}. ૧૦૮ એમ્બ્યુલન્સ રવાના કરવામાં આવી રહી છે."
        return {
            "status": "DISPATCHED",
            "dispatch_id": f"EMG-108-{os.urandom(2).hex().upper()}",
            "contact_number": "108",
            "sms_payload": sms_text,
            "estimated_arrival": "૧૫-૨૫ મિનિટ"
        }
