var app = new Vue({
  el: '#app',
  data: {
    items: [],
    selectedUser: '',
    searchedItems: [],
    searchView: false,
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getUserPosts(selectedUser) {
      try {
        this.searchView = true;
        let response = await axios.get("/api/items/:+selectedUser");
        this.searchedItems = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    defaultClick()
    {
      this.searchView = false;

    },



  },
  created() {
    this.getItems();
  },
});