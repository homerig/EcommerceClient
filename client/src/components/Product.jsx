import './Product.css';

const Product = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.img} alt={product.name} className="product-image" />
      <div className="product-name">{product.name}</div>
      <div className="product-price">${product.price.toLocaleString()}</div>
    </div>
  );
};

export default Product;
