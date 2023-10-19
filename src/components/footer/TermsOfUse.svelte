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
    <div>
        <SvelteMarkdown source={markdownContent}/>
    </div>
  </div>

  <style>
    .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: calc(var(--spacer)*2);
        text-align: left;
    }
    .description{
        margin-bottom: calc(var(--spacer));
    }
  </style>