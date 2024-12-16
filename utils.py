from selenium.webdriver.common.by import By
def extract_text(driver, xpath, remove_text=None):
    """Utility function to extract text from a given XPath."""
    try:
        element = driver.find_element(By.XPATH, xpath)
        text = element.text
        return text.replace(remove_text, "").strip() if remove_text else text
    except Exception:
        return ""
