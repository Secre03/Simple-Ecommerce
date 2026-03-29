const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
  .quantity-input {
    width: 60px;
    padding: 2px 5px;
    margin: 0 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    text-align: center;
  }
  .action-link {
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
    margin-left: 10px;
  }
  .action-link:hover {
    color: #0056b3;
  }
  .is-editing-quantity .quantity-label {
    display: none;
  }
  .progress-bar-fill {
    transition: width 0.5s ease-in-out;
    height: 100%;
    background-color: #28a745;
  }
  .status-label {
    opacity: 0.5;
    transition: opacity 0.3s ease;
  }
  .status-label.status-current {
    opacity: 1;
    font-weight: bold;
    color: #28a745;
  }
`;
document.head.appendChild(style);