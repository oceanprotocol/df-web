<script>
  import SvelteMarkdown from "svelte-markdown";

    let markdownContent = '';
  
    fetch('/resources/terms.md')
      .then(response => response.text())
      .then(text => {
        markdownContent = text;
      });
  </script>
  
  <div class="container">
    <h2>Terms and Conditions</h2>
    <p class="description">Thanks for using our product and services</p>
    <SvelteMarkdown source={markdownContent}/>
  </div>

  <style>
    .container{
        margin-top: calc(var(--spacer)*2);
    }
    .description{
        margin-bottom: calc(var(--spacer));
    }
  </style>