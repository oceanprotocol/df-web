<script>
  import Modal from "../common/Modal.svelte";


    const ExternalIcon = "/images/external.svg";
  
    export let showModal;
    export let url;
    export let className = undefined;
    export let color = undefined;
    export let hideIcon = false;

    $:showModal && console.log(showModal())
  </script>
  
  <Modal bind:showModal>
    <div>
        <h3>Hello modal</h3>
    </div>
  </Modal>
  
  <style>

  </style>
  