export const forgotPassword = `
<style>

  .message {
    font-family: Arial, Helvetica, sans-serif;
  }

</style>

<div class="message">
  <p>Hi, {{firstName}}</p>

  Check your email by <a href="{{link}}">clicking here</a>.

  Token: {{token}}
</div>
`
