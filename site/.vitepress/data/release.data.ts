export default {
  async load() {
    try {
      const response = await fetch('https://api.github.com/repos/kaloscope/kaloscope/releases/latest');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { version: data.tag_name };
    } catch (error) {
      console.error('Failed to fetch latest release:', error);
      return { version: '' };
    }
  }
};
