var app = new Vue({
  el: '#admin',
  data: {
    items: [],
    text: '',
    title: '',
    user: '',
    item: null,
    newText: '',
    newTitle: '',
    newUser: '',
    newId: '',
    searchTitle: '',
    objectsFound: false,
    editOpen: false,

    
  },

  methods: {
    async addNewItem(){
      try {
        let result = await axios.post('/api/posts', {
          title: this.title,
          user: this.user,
          text: this.text,
        });
        console.log(result);
        this.title = "";
        this.text = "";
        this.user = "";
      } catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        console.log(response.data)
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteItem(id) {
      try {
        let response = await axios.delete("/api/items/" + id);
        this.findItem = null;
      } catch (error) {
        console.log(error);
      }
    },

    async editItem(id) {
      try {
        let response = await axios.put("/api/items/" + id, {
          title: this.newTitle,
          user: this.newUser,
          text: this.newText,
        });
        this.findItem = null;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    //Get all Posts with Title:
    async searchByTitle() {
      this.editOpen = false;
      this.objectsFound = false;
      this.items = [];
      try{
        if (this.searchTitle == '') {
          this.getItems();
          console.log("No input recieved, recieved all items");
          this.objectsFound = true;
          return;
        }
        let response = await axios.get("/api/items/title/" + this.searchTitle );
        this.items = response.data;
        console.log(response.data);
        this.objectsFound = true;

      } catch (error) {
        console.log(error);
      }
    },
  },

  

  
});
