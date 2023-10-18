<script>
    import { Link, useLocation } from "svelte-navigator";
  
    let termsUrl = "https://docs.oceanprotocol.com/veocean-data-farming";
    const location = useLocation();
  </script>

  <footer>
    <nav>
      <ul>
        <li >
          <Link to="/terms" class="link">Terms of use</Link>
        </li>
      </ul>
    </nav>
</footer>
  
  <style>

    footer{
        margin-top: calc(var(--spacer)*2);
    }
  
    nav {
      display: flex;
      justify-content: center;
    }
  
    ul {
      position: relative;
      padding: calc(var(--spacer)/3) 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      list-style: none;
      background: var(--background);
      background-size: contain;
      display: flex;
      flex-wrap: wrap;
    }
  
    li {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    :global(nav a) {
      display: flex;
      height: 100%;
      align-items: center;
      padding: 0 0.4rem;
      padding-bottom: 1rem;
      color: var(--brand-grey-light);
      font-weight: 700;
      text-decoration: none;
      font-size: var(--font-size-base);
      letter-spacing: 0.1em;
      text-decoration: none;
      transition: color 0.2s linear;
    }
  
    li > :global(a):hover {
      color: var(--accent-color);
    }
  
    @media (min-width: 660px) {
     
    }
  </style>
  