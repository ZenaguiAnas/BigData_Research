import csv
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from config import CHROME_DRIVER_PATH, URL, OUTPUT_CSV_PATH

def extract_articles():
    service = Service(CHROME_DRIVER_PATH)

    driver = webdriver.Chrome(service=service)
    driver.get(URL)

    with open(OUTPUT_CSV_PATH, "w", newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file)
        
        csv_writer.writerow([
            "Title", "Authors", "HTML Link", "PDF Link", 
            "Abstract", "Published in", "Date of Publication", 
            "Page(s)", "Electronic ISSN", "PubMed ID", 
            "DOI", "DOI Link", "Publisher"
        ])

        try:
            search_input = driver.find_element(By.CSS_SELECTOR, 'input[aria-label="main"]')
            search_input.send_keys('blockchain')
            search_input.send_keys(Keys.RETURN)

            journals_checkbox = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[id="refinement-ContentType:Journals"]'))
            )
            journals_checkbox.click()

            apply_button = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, 'div.facet-ctype-apply-container > button.xpl-btn-primary'))
            )
            apply_button.click()

            while True:
                index = 0
                while True:
                    articles = WebDriverWait(driver, 10).until(
                        EC.presence_of_all_elements_located((By.CLASS_NAME, "List-results-items"))
                    )

                    if index >= len(articles):
                        break

                    article_data = {}
                    article = articles[index]
                    title_element = article.find_element(By.TAG_NAME, "h3").find_element(By.TAG_NAME, "a")
                    article_data["Title"] = title_element.text

                    authors_list = article.find_elements(By.CSS_SELECTOR, "xpl-authors-name-list .author a")
                    article_data["Authors"] = "; ".join(author.text for author in authors_list)

                    article_data["HTML Link"] = article.find_element(By.XPATH, ".//a[contains(@href, '/document/')]").get_attribute("href")
                    article_data["PDF Link"] = article.find_element(By.XPATH, ".//a[contains(@href, '/stamp/stamp.jsp')]").get_attribute("href")

                    title_element.click()

                    article_data["Abstract"] = extract_text(driver, "//div[contains(@class, 'abstract-text')]//div[contains(@class, 'u-mb-1')]", "Abstract:")
                    article_data["Published in"] = extract_text(driver, "//div[contains(@class, 'stats-document-abstract-publishedIn')]/a")
                    article_data["Date of Publication"] = extract_text(driver, "//div[contains(@class, 'doc-abstract-pubdate')]", "Date of Publication:")
                    article_data["Page(s)"] = extract_text(driver, "//div[contains(@class, 'u-pb-1') and contains(., 'Page(s)')]", "Page(s):")
                    article_data["Electronic ISSN"] = extract_text(driver, "//div[contains(@class, 'u-pb-1') and contains(., 'Electronic ISSN:')]", "Electronic ISSN:")
                    article_data["PubMed ID"] = extract_text(driver, "//div[contains(@class, 'u-pb-1') and contains(., 'PubMed ID:')]/a")
                    doi_element = extract_text(driver, "//div[contains(@class, 'stats-document-abstract-doi')]/a")
                    article_data["DOI"] = doi_element
                    article_data["DOI Link"] = driver.find_element(By.XPATH, "//div[contains(@class, 'stats-document-abstract-doi')]/a").get_attribute("href") if doi_element else ""
                    article_data["Publisher"] = extract_text(driver, "//span[contains(@class, 'publisher-info-container')]", "Publisher:")

                    csv_writer.writerow([
                        article_data["Title"], 
                        article_data["Authors"], 
                        article_data["HTML Link"], 
                        article_data["PDF Link"], 
                        article_data["Abstract"], 
                        article_data["Published in"], 
                        article_data["Date of Publication"], 
                        article_data["Page(s)"], 
                        article_data["Electronic ISSN"], 
                        article_data["PubMed ID"], 
                        article_data["DOI"], 
                        article_data["DOI Link"], 
                        article_data["Publisher"]
                    ])

                    driver.back()
                    print(index)
                    index += 1

                try:
                    next_button = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, "//li[contains(@class, 'next-btn')]//button"))
                    )

                    if "disabled" in next_button.get_attribute("class"):
                        print("No more pages available.")
                        break

                    next_button.click()
                    time.sleep(3)

                except Exception as e:
                    print(f"An error occurred while trying to navigate to the next page: {e}")
                    break

        finally:
            driver.quit()

def extract_text(driver, xpath, remove_text=None):
    """Utility function to extract text from a given XPath."""
    try:
        element = driver.find_element(By.XPATH, xpath)
        text = element.text
        return text.replace(remove_text, "").strip() if remove_text else text
    except Exception:
        return ""
