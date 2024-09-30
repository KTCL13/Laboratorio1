const { createApp, ref } = Vue;

createApp({
  data() {
    return {
      servers: [],
      logs: [],
      instance: "",
      requests: ""
    };
  },
  mounted() {
    this.loadLogs();
  },
  methods: {
    async loadLogs() {
      try {
        const response = await fetch("http://localhost:5000/status");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        this.servers = data;
        console.log(this.servers); // Corrected the logging statement
      } catch (error) {
        console.error("Error loading logs:", error);
      }
    }
  },
}).mount("#app");
