import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { useNavigate } from "react-router-dom";
import { responseToast } from "../../../utils/features";

interface ProductDetails  {
  detailsHead: string,
  detailsSub: string,
}

interface ItemDetails {
  aboutsHead: string,
  aboutsSub: string,
}

interface AdditionalInfo {
  infoHead: string,
  infoSub: string,
}

const NewProduct = () => {

  const { user } = useSelector((state: { userReducer: UserReducerInitialState}) => state.userReducer);

  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetails[]>([]);
  const [itemAbouts, setItemAbouts] = useState<ItemDetails[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo[]>([]);

  const [photo, setPhoto] = useState<File[]>([]);

  const [newProduct] = useNewProductMutation();

  const handleDetailsChange = (index: number, key: keyof ProductDetails) => (e: ChangeEvent<HTMLInputElement>) => {
    const newDetails = [...productDetails];
    newDetails[index][key] = e.target.value;
    setProductDetails(newDetails);
  }

  const removeProductDetail = (index:number) => {
    const removeDetails = [...productDetails];
    removeDetails.splice(index, 1);
    setProductDetails(removeDetails);
  }

  const addProductDetail = () => {
    setProductDetails([...productDetails , { detailsHead: '', detailsSub: ''}]);
  }

  const handleAboutsChange = (index: number, key: keyof ItemDetails) => (e: ChangeEvent<HTMLInputElement>) => {
    const newItemDetails = [...itemAbouts];
    newItemDetails[index][key] = e.target.value;
    setItemAbouts(newItemDetails);
  }

  const removeItemAbout = (index: number) => {
    const removeAbout = [...itemAbouts];
    removeAbout.splice(index, 1);
    setItemAbouts(removeAbout);
  }

  const addItemAbout = () => {
    setItemAbouts([...itemAbouts, { aboutsHead: '', aboutsSub: ''}]);
  } 

  const handleInfoChange = (index: number, key: keyof AdditionalInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    const newAddInfo = [...additionalInfo];
    newAddInfo[index][key] = e.target.value;
    setAdditionalInfo(newAddInfo);
  }
  
  const removeInfo = (index: number) => {
    const removeInfo = [...additionalInfo];
    removeInfo.splice(index, 1);
    setAdditionalInfo(removeInfo);
  }

  const addInfo = () => {
    setAdditionalInfo([...additionalInfo, { infoHead: '', infoSub: ''}]);
  }

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files) {
      const newPhotos: File[] = Array.from(files);
      const previews: string[] = [];

      newPhotos.forEach((file) => {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            previews.push(reader.result);
            if (previews.length === newPhotos.length) {
              setPhotoPrev(previews);
              setPhoto(newPhotos);
            }
          }
        };
      });
  };
}
  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!name || !category || stock < 0 || !price || !photo) return;
    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock",stock.toString());
    productDetails.forEach((detail, index) => {
      formData.append(`productDetails[${index}][detailsHead]`, detail.detailsHead);
      formData.append(`productDetails[${index}][detailsSub]`, detail.detailsSub);
    })
    itemAbouts.forEach((about, index) => {
      formData.append(`itemAbouts[${index}][aboutsHead]`, about.aboutsHead);
      formData.append(`itemAbouts[${index}][aboutsSub]`, about.aboutsSub);
    })
    additionalInfo.forEach((info, index) => {
      formData.append(`additionalInfo[${index}][infoHead]`, info.infoHead);
      formData.append(`additionalInfo[${index}][infoSub]`, info.infoSub)
    })
    console.log(productDetails);
    photo.forEach((file) => {
      formData.append(`photos`, file);
    });
    formData.set("category", category);
    const res = await newProduct({ id: user?._id!, formData});
    responseToast(res, navigate, "/admin/product");
  }


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler} >
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            {productDetails.map((detail, index) => (
              <div key={index}>
                <div>
                  <div style={{ width: "30%"}}>
                    <label>Details Title</label>
                    <input type="text" required placeholder="Product details title" value={detail.detailsHead} onChange={handleDetailsChange(index, 'detailsHead')} />
                  </div>
                  <div style={{ width: "70%"}}>
                    <label>Details Sub-Title</label>
                    <input type="text" required placeholder="Product details sub-title" value={detail.detailsSub} onChange={handleDetailsChange(index, 'detailsSub')} />
                  </div>
                  <button type="button" onClick={()=> removeProductDetail(index)}><MdDelete/></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addProductDetail}>Add Deails</button>

            {itemAbouts.map((about, index) => (
              <div key={index}>
                <div>
                  <div style={{ width: "30%"}}>
                    <label>About Title</label>
                    <input type="text" required placeholder="Item abouts title" value={about.aboutsHead} onChange={handleAboutsChange(index, 'aboutsHead')} />
                  </div>
                  <div style={{ width: "70%"}}>
                    <label>About Sub-Title</label>
                    <input type="text" required placeholder="Item abouts sub-title" value={about.aboutsSub} onChange={handleAboutsChange(index, 'aboutsSub')} />
                  </div>
                  <button type="button" onClick={()=> removeItemAbout(index)}><MdDelete/></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addItemAbout}>Add About Items</button>

            {additionalInfo.map((info, index) => (
              <div key={index}>
                <div>
                  <div style={{ width: "30%"}}>
                    <label>Additional Info Title</label>
                    <input type="text" required placeholder="Additional info title" value={info.infoHead} onChange={handleInfoChange(index, 'infoHead')} />
                  </div>
                  <div style={{ width: "70%"}}>
                    <label>Additional Info Sub-Title</label>
                    <input type="text" required placeholder="Additional info sub-title" value={info.infoSub} onChange={handleInfoChange(index, 'infoSub')} />
                  </div>
                  <button type="button" onClick={()=> removeInfo(index)}><MdDelete/></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addInfo}>Add Additional Info</button>

            <div>
              <label>Photo</label>
              <input required type="file" onChange={changeImageHandler} multiple />
            </div>

            <div>
              {photoPrev.map((preview, index) => (
                <img key={index} src={preview} alt={`Image ${index}`} />
              ))}
            </div>
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
