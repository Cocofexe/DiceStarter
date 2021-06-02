/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import './productDetail.css';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import {productDetail} from '../../../app/reducers/handleProductsReducer';
import ColorCircle from '../../DummyComponents/colorCircle/ColorCircle';
import {changeProductInDBAsync, getProductByIdAsync}
  from '../../../app/actions/handleProductsActions/index';
import UserReviews from '../userReviews/userReviews';
import Carousel from '../../DummyComponents/carousel/carousel';
import {userInfo, userToken} from '../../../app/reducers/registerReducer';
import {addProductInCart} from '../../../app/actions/cartActions/index';
import RatingStars from '../../DummyComponents/ratingStars/ratingStars';
import swal from 'sweetalert2';
import {addProductInWishlist} from '../../../app/actions/wishlistActions';
import LoadingScreen from '../../DummyComponents/loadingScreen/loadingScreen';
import Select from 'react-select';
import {getCategoriesAsync} from '../../../app/actions/handleProductsActions/index';
import {productCategories} from '../../../app/reducers/handleProductsReducer';

function ProductDetail(props:any ) {
  const token = useAppSelector(userToken);
  const User = useAppSelector(userInfo);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();
  const product = useAppSelector(productDetail);
  const categories = useAppSelector(productCategories);
  const id = props.match.params.id;
  useEffect(() => {
    dispatch(getProductByIdAsync(id))
        .then((p) => {
          setChanges(p);
        }).catch((err) => console.error(err));
  }, []);
  const handleOnCart = () => {
    const duplicate = JSON.parse(localStorage
        .getItem('cart') || '[]').find((el) => el.id === product.id);
    if (duplicate) {
      swal.fire({
        text: 'You already added this product to cart!',
        icon: 'info',
      });
    } else {
      dispatch(addProductInCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.picture[0],
        stock: product.stock,
        amount: 1,
      }, User.id, User.address));
      swal.fire({
        text: 'Product added succesfully!',
        icon: 'success',
      });
    }
  };
  const handleOnWishlist = () => {
    const duplicate = JSON.parse(localStorage
        .getItem('wishlist') || '[]').find((el) => el.id === product.id);
    if (duplicate) {
      swal.fire({
        text: 'You already added this product to wishlist!',
        icon: 'info',
      });
    } else {
      dispatch(addProductInWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.picture[0],
        stock: product.stock,
        amount: 1,
      }, User.id));
      swal.fire({
        text: 'Product added succesfully!',
        icon: 'success',
      });
    }
  };
  // saves changes to product
  const style = {
    container: (provided, state) => ({
      ...provided,
      outline: 'none',
      backgroundColor: '#101010',
      color: 'white',
    }),
    control: (provided, state) => ({
      ...provided,
      border: state.isSelected ? 'none' : 'white',
      boxShadow: 'none',
      backgroundColor: '#101010',
      color: 'white',
    }),
    ValueContainer: () => ({
      backgroundColor: '#101010',
      color: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#74009D': '#101010',
      cursor: state.isFocused ? 'pointer': 'default',
      color: 'white',
    }),
    IndicatorsContainer: (provided, state) => ({
      ...provided,
      backgroundColor: '#101010',
      cursor: state.isFocused ? 'pointer': 'default',
      color: 'white',
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: '#101010',
      color: 'white',
    }),
  };

  const handleSelectChange = (e:any) => {
    setProductDetailCategories(e);
  };

  const handleProductChange = () => {
    dispatch(changeProductInDBAsync(changes, token))
        .then((r) => {
          if (r !== 'error') {
            swal.fire({
              text: 'Changes Saved!',
              icon: 'success',
            });
          } else {
            swal.fire({
              text: 'Oops, something went wrong',
              icon: 'error',
            });
          }
        }).catch((err) => console.error(err));
    setEditMode(!editMode);
  };
  const [changes, setChanges] = useState({
    id: product?.id,
    name: product?.name,
    picture: product?.picture,
    price: product?.price,
    size: product?.size,
    color: product?.color,
    available: product?.available,
    stock: product?.stock,
    description: product?.description,
    categories: product?.categories,
    rating: product?.rating,
  });

  const [productDetailCategories, setProductDetailCategories] = useState(product?.categories.map((c) => {
    return {
      value: c.id,
      label: c.name,
    };
  }));

  /* useEffect(() => {
    setChanges({...changes, categories: productDetailCategories?.map((c) => c.value)});
  }, [changes]);
  */
  useEffect(() => {
    dispatch(getCategoriesAsync());
  }, []);
  const handleNameChange = (e:any) => setChanges({...changes, name: e.target.innerText});
  const handleDescriptionChange = (e:any) => setChanges({...changes, description: e.target.innerText});
  const handleStockChange = (e:any) => setChanges({...changes, stock: e.target.innerText});
  const handleSizeChange = (e:any) => setChanges({...changes, size: e.target.innerText});
  const handlePriceChange = (e:any) => setChanges({...changes, price: e.target.innerText});
  console.log(changes);
  return (
    <div className='productDetailBackground'>
      {
        product === null &&
            <LoadingScreen />
      }
      { product !== null &&
      <div>
        <div className='ProductDetailGridAll'>
          <div className='carouselandinfo'>
            <Carousel pictures={product.picture}/>
            <div className='ProductDetailGrid'>
              <h2 className={!editMode ? 'ProductDetailName' : 'editableProductDetailName'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleNameChange}>{
                product.name} </h2>
              <div className='ProductDetailRating'>
                <RatingStars rating={product.rating}/>
              </div>
              { editMode === false ?
                <div> {product.categories.map((c, i) => <span key={i} className='productDetailCategories'>{c.name}</span>)}
                </div> :
                <div className='ProductDetailSelect'>
                  <Select onChange={handleSelectChange} styles={style} isMulti value={productDetailCategories} name='categories' options={categories}>
                  </Select>
                </div>
              }
              <div className='productDetailinformation'>
                <div className='productDetailButton'>
                  <p>Price:
                    { product.priceDiscount || product.discount ?
                  <span className='ProductDetailPrices'>
                    <span className='productDetailPriceDiscount' onInput={handlePriceChange}>
                      ${product.price}
                    </span>
                    {product.priceDiscount !== null ?
                    <span className='productDetailDiscount'> ${product.priceDiscount}</span> :
                    <span className='productDetailDiscount'>
                      ${parseFloat(product.price) -
                      parseFloat((parseFloat(product.price) *
                      product.discount/100).toFixed(2))}</span>}
                  </span> :
                    <span className={editMode ? 'editable' :'noteditable'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handlePriceChange}>
                      ${product.price}
                    </span>
                    }
                  </p>
                  {
                    User.role !== 'Admin' ?
                      <div className= 'productDetailUserButtons'>
                        <button className='productDetailAddToCart' onClick={handleOnCart}>
                        Add to Cart
                        </button>
                        <button className='productDetailAddToCart' onClick={handleOnWishlist}>
                        Add to Wishlist
                        </button>
                      </div>:
                      <button type='button' className=' material-icons productDetailEdit' onClick={() => setEditMode(!editMode)}>
                        edit
                      </button>
                  }
                  {
                      editMode && (changes?.name !== product.name || changes?.description !== product.description || changes?.price !== product.price || changes?.size !== product.size || changes?.stock !== product.stock) ?
                      <button className='material-icons productDetailSave' onClick={handleProductChange}>save</button> : null
                  }
                </div>
                <div className='productDetailInfo'>
                  <div className='ProductDetailColors'>
                    <span className='productDetailColorsTitle'>Color: </span>
                    {product.color.length ?
                product.color.map((el:any) => <ColorCircle key={el} color={el}
                  onClick={() => {
                    const toChange =
                product.color.filter((color:any) => el !== color);
                    setChanges({...changes, color: toChange});
                  }}/>):null}</div>
                  <p>Stock:
                    <span className={editMode ? 'editable':'noteditable'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleStockChange}>
                      {product.stock}
                    </span>
                  </p>
                  <p>Size:
                    <span className={editMode ? 'editable':'noteditable'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleSizeChange}>
                      {product.size}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='detailDescription'>
            <h3 className='productDetailDescritionTitle'>Description</h3>
            <p className={editMode ? 'editableProductDetailDescription': 'ProductDetailDescription'} suppressContentEditableWarning={true} contentEditable={editMode} onInput={handleDescriptionChange}>
              {product.description}
            </p>
          </div>
        </div>
        <UserReviews id={id}/>
      </div>
      }
    </div>
  );
}

export default ProductDetail;
