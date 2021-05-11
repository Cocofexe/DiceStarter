import React, {useEffect, useState} from 'react';
import './productDetail.css';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {productDetail} from '../../app/reducers/handleProductsReducer';
import ColorCircle from '../colorCircle/ColorCircle';
import {
  ProductRes,
} from '../../types';
import {getProductByIdAsync} from '../../app/actions/handleProductsActions';

function ProductDetail(props:any ) {
  const [input, setInput] = useState<ProductRes>({
    id: props.id,
    name: props.name,
    picture: props.picture,
    price: props.price,
    size: props.size,
    color: props.color,
    available: props.available,
    stock: props.stock,
    description: props.description,
    rating: props.rating,
    categories: [],
  });
  const dispatch = useAppDispatch();
  const product = useAppSelector(productDetail);
  const id = props.match.params.id;
  useEffect(() => {
    dispatch(getProductByIdAsync(id));
  }, []);
  return (
    <div>
      { product &&
        <div className='ProductDetailGridAll'>
          <div className='ProductDetailGrid'>
            <h1 className='ProductDetailName'>{product.name}</h1>
            <img className='ProductDetailImage' src={product.picture}/>
            <p className='ProductDetailPrice'>
            Price: {product.price}
            </p>
            <p className='ProductDetailStock'>
            Stock: {product.stock}
            </p>
            <p className='ProductDetailRating'>
              Rating: {product.rating}
            </p>
            <p className='ProductDetailSize'>Size: {product.size}</p>
            {product.available === true ?
            <p className='ProductDetailAvailable'>Available</p> :
            <p className='ProductDetailAvailable'>Sold</p>}
            <p className='ProductDetailColors'>
              {product.color.length?
              product.color.map((el) => <ColorCircle key={el} color={el}
                onClick={() => {
                  const toChange =
                product.color.filter((color) => el !== color);
                  setInput({...input, color: toChange});
                }}/>):null}</p>
            <p className='ProductDetailDescription'>{product.description}
            </p>
          </div>
        </div>
      }
    </div>
  );
}

export default ProductDetail;
