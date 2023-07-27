<script>
    import { useNavigate, useLocation } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();
    navigate($location.pathname =='/datafarming' ? 'volume-df' : '/rewards')
</script>
  