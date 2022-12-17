Vue.component( 'search-result' , {
  template: `
    <article class="result">
      <a v-if="image" :href="link" title="Link to wiki" target="_blank">
        <img :src="image" :alt="title" class="image">
      </a>
        <a :href="link" title="Link to wiki" target="_blank" class="title">
          <h2 class="title">{{ title }}</h2>
        </a>
        <p class="extract">{{ extract }}</p>
        <a class="wikiLink" :href="link"><b>Know more</b></a>.
    </article>
  `,
  props: [ 'title','extract','link','image' ]
} );

const vue = new Vue( {
  el: '.content',
  data: {
    searchString  : '',
    searching     : true,
    showFindBar   : true,
    wikiResults   : [],
  },
  methods: {
    showFindBaronBottom ( ) {
      if ( (window.innerHeight + window.scrollY ) <= document.body.offsetHeight-20 ) {
        this.showFindBar = true;
      } else {
        this.showFindBar = false;
      }
    },
    getWikiURL ( id ) {
      return "https://en.wikipedia.org/wiki/"+ encodeURI( id );
    },
    getWikiResults ( ) {
      this.wikiResults = [];
      const URL  = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&piprop=name|thumbnail&pithumbsize=250&exsentences=1&exlimit=max&exintro=1&explaintext=1&gsrnamespace=0&rawcontinue&gsrlimit=20&origin=*&gsrsearch=${ this.searchString }`;

      axios.get( URL )
        .then( results => {
          results = results.data.query.pages;
          for ( let entries in results ) {
            if ( results.hasOwnProperty( entries ) ) {
              let entry = results[ entries ];
              this.wikiResults.push( entry );
            }
          }
          this.searching = false
        } )
        .catch( err => console.log( err ) );
    }
  },
  computed: {
    orderEntries () {
      return _.orderBy( this.wikiResults, 'index' );
    }
  },
  created () {
    window.addEventListener( 'scroll', this.showFindBaronBottom );
  },
  destroyed () {
    window.removeEventListener('scroll', this.showFindBaronBottom );
  }
} );
