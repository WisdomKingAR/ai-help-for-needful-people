from pdfminer.high_level import extract_text
import os

pdf_path = r"d:\AARYAN\HACKATHONS\ACCESSIBILITY AI\PROJECT RESEARCH\TESTING\TEST REPORT 1.pdf"
output_path = r"d:\AARYAN\HACKATHONS\ACCESSIBILITY AI\CODES\ai-help-for-needful-people\testsprite_tests\extracted_report_miner.txt"

def run_extraction():
    try:
        print(f"Extracting text from {pdf_path}...")
        text = extract_text(pdf_path)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
            
        print(f"Successfully extracted {len(text)} characters to {output_path}")
        print("\nPREVIEW:\n" + text[:2000])
        
    except Exception as e:
        print(f"Error extracting PDF with pdfminer: {e}")

if __name__ == "__main__":
    run_extraction()
