#!/usr/bin/env python3
"""
DTO Quality Analyzer for SEMOP Backend
Analyzes DTOs compliance with architectural standards
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

class DTOQualityAnalyzer:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'layers': {},
            'summary': {
                'total_components': 0,
                'compliant_components': 0,
                'violations': {
                    'local_dtos': 0,
                    'missing_contracts': 0,
                    'any_types': 0,
                    'missing_phase_comments': 0
                }
            },
            'components': []
        }
        
    def analyze(self):
        """Main analysis method"""
        layers = ['1-core-services', '2-ocmp', '3-vertical-applications']
        
        for layer in layers:
            layer_path = self.base_path / 'libs' / layer
            if layer_path.exists():
                self.analyze_layer(layer, layer_path)
        
        self.calculate_summary()
        return self.results
    
    def analyze_layer(self, layer_name, layer_path):
        """Analyze a specific layer"""
        self.results['layers'][layer_name] = {
            'components': [],
            'total': 0,
            'compliant': 0
        }
        
        # Find all components in this layer
        for component_dir in layer_path.iterdir():
            if component_dir.is_dir() and not component_dir.name.startswith('.'):
                component_result = self.analyze_component(layer_name, component_dir)
                if component_result:
                    self.results['layers'][layer_name]['components'].append(component_result)
                    self.results['components'].append(component_result)
                    self.results['layers'][layer_name]['total'] += 1
                    if component_result['is_compliant']:
                        self.results['layers'][layer_name]['compliant'] += 1
    
    def analyze_component(self, layer_name, component_path):
        """Analyze a single component"""
        component_name = component_path.name
        
        result = {
            'layer': layer_name,
            'name': component_name,
            'path': str(component_path.relative_to(self.base_path)),
            'violations': [],
            'is_compliant': True,
            'files_analyzed': 0,
            'details': {
                'has_local_dtos': False,
                'uses_contracts': False,
                'has_any_types': False,
                'has_phase_comments': False,
                'local_dto_files': [],
                'any_type_locations': [],
                'files_with_contracts': [],
                'files_with_phase_comments': []
            }
        }
        
        # Find all TypeScript files
        ts_files = list(component_path.rglob('*.ts'))
        result['files_analyzed'] = len(ts_files)
        
        if len(ts_files) == 0:
            return None
        
        # Check for local DTO files
        dto_files = list(component_path.rglob('*.dto.ts'))
        if dto_files:
            result['violations'].append('local_dtos_found')
            result['is_compliant'] = False
            result['details']['has_local_dtos'] = True
            result['details']['local_dto_files'] = [str(f.relative_to(component_path)) for f in dto_files]
            self.results['summary']['violations']['local_dtos'] += len(dto_files)
        
        # Analyze each TypeScript file
        for ts_file in ts_files:
            if ts_file.name.endswith('.spec.ts') or ts_file.name.endswith('.test.ts'):
                continue
                
            try:
                content = ts_file.read_text(encoding='utf-8')
                
                # Check for @semop/contracts imports
                if '@semop/contracts' in content:
                    result['details']['uses_contracts'] = True
                    result['details']['files_with_contracts'].append(str(ts_file.relative_to(component_path)))
                
                # Check for PHASE comments
                if re.search(r'//\s*PHASE\s*\d+', content, re.IGNORECASE):
                    result['details']['has_phase_comments'] = True
                    result['details']['files_with_phase_comments'].append(str(ts_file.relative_to(component_path)))
                
                # Check for 'any' types
                any_pattern = r':\s*any\b|<any>|Array<any>|Promise<any>'
                any_matches = re.finditer(any_pattern, content)
                for match in any_matches:
                    line_num = content[:match.start()].count('\n') + 1
                    result['details']['any_type_locations'].append({
                        'file': str(ts_file.relative_to(component_path)),
                        'line': line_num
                    })
                    result['details']['has_any_types'] = True
                
            except Exception as e:
                print(f"Error reading {ts_file}: {e}")
        
        # Check violations
        if not result['details']['uses_contracts'] and not result['details']['has_local_dtos']:
            result['violations'].append('no_contracts_usage')
            result['is_compliant'] = False
            self.results['summary']['violations']['missing_contracts'] += 1
        
        if result['details']['has_any_types']:
            result['violations'].append('any_types_found')
            result['is_compliant'] = False
            self.results['summary']['violations']['any_types'] += len(result['details']['any_type_locations'])
        
        if not result['details']['has_phase_comments']:
            result['violations'].append('missing_phase_comments')
            result['is_compliant'] = False
            self.results['summary']['violations']['missing_phase_comments'] += 1
        
        return result
    
    def calculate_summary(self):
        """Calculate summary statistics"""
        self.results['summary']['total_components'] = len(self.results['components'])
        self.results['summary']['compliant_components'] = sum(
            1 for c in self.results['components'] if c['is_compliant']
        )
        
        if self.results['summary']['total_components'] > 0:
            self.results['summary']['compliance_rate'] = round(
                (self.results['summary']['compliant_components'] / 
                 self.results['summary']['total_components']) * 100, 2
            )
        else:
            self.results['summary']['compliance_rate'] = 0.0
    
    def save_results(self, output_path):
        """Save results to JSON file"""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    analyzer = DTOQualityAnalyzer('/home/ubuntu/unified-backend-monorepo')
    results = analyzer.analyze()
    
    # Save to JSON
    output_file = f'/home/ubuntu/reports/dto_analysis_{datetime.now().strftime("%Y-%m-%d")}.json'
    analyzer.save_results(output_file)
    
    print(f"Analysis complete. Results saved to {output_file}")
    print(f"Total components: {results['summary']['total_components']}")
    print(f"Compliant components: {results['summary']['compliant_components']}")
    print(f"Compliance rate: {results['summary']['compliance_rate']}%")
