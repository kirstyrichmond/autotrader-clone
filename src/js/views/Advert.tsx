import React, { DragEvent, useEffect, useRef, useState } from 'react';
import { Camera, Star, Calculator, FileText, Video, ChevronUp, ChevronRight, Info, X, RotateCw, Trash2, ArrowLeft } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import { VehicleData } from '../../store/slices/advertSlice';
import { useAppDispatch } from '../../store/hooks';
import { createVehicleListing, updateVehicleListing } from '../../store/slices/listingsSlice';
import { Form, Formik, FormikHelpers } from 'formik';
import { advertSchema } from '@/schemas';
import { API_BASE_URL } from '../config/api';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Select from '@/components/Select';

interface AdvertInitialValues {
  user_id: number | undefined;
  id: number;
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuel_type: string;
  body_type: string;
  transmission: string;
  owners: number | null;
  mot_due: string;
  colour: string;
  price: number | null;
  description: string;
  location: string;
  postcode: string;
  latitude: number;
  longitude: number;
  power: string;
  service_history: string;
  condition: string;
  dealer_name: string;
  dealer_rating: number | null;
  review_count: number | null;
  engine_size: string;
  registration: string;
  date_first_registered: string;
  attention_grabber: string;
  images: ImageData[];
};

interface ImageData {
  preview: string;
  url: string;
  id: string;
  caption?: string;
  is_primary: boolean;
  colorSpace: PredefinedColorSpace;
  data: Uint8ClampedArray;
  height: number;
  width: number;
}

interface ImageGridProps {
  images: ImageData[];
  onReorder: (images: ImageData[]) => void;
  onRemove: (index: number) => void;
  mainImageIndex: number;
  onSetMainImage: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onReorder,
  onRemove,
  mainImageIndex,
  onSetMainImage
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const items = [...images];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);
    
    onReorder(items);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`relative group ${index === mainImageIndex ? 'col-span-2 row-span-2' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <img
            src={image.preview}
            alt={`Car image ${index + 1}`}
            className={`w-full h-full object-cover rounded-lg border-2 
              ${index === mainImageIndex ? 'border-blue-500' : 'border-transparent'}`}
          />
          
          {/* Image Actions Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                        transition-opacity rounded-lg flex items-center justify-center gap-2">
            
            {/* Set as Main Photo Button */}
            {index !== mainImageIndex && (
              <button
                onClick={() => onSetMainImage(index)}
                className="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Set as main photo"
              >
                <Star className="w-5 h-5 text-blue-600" />
              </button>
            )}
            
            {/* Rotate Button */}
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Rotate image"
            >
              <RotateCw className="w-5 h-5 text-gray-600" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onRemove(index)}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Remove image"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>

          {/* Main Photo Badge */}
          {index === mainImageIndex && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
              Main image
            </div>
          )}

          {/* Image Number Badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {index + 1} / {images.length}
          </div>
        </div>
      ))}
    </div>
  );
};

const Advert: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const vehicleData = useSelector((state: RootState) => state.advert.vehicleData);
  const [newVehicleData, setNewVehicleData] = useState(vehicleData);

  const processedImages = images.map((image, index) => ({
    preview: image.preview,
    url: image.url,
    id: image.id,
    is_primary: index === mainImageIndex
  }));

  const validImages = processedImages.filter((img): img is ImageData => img !== null);

  const initialValues: AdvertInitialValues = {
    user_id: user?.id,
    id: id ? parseInt(id) : (newVehicleData?.id ?? 0),
    make: newVehicleData?.make ?? "",
    model: newVehicleData?.model ?? "",
    year: newVehicleData?.year ?? "",
    mileage: newVehicleData?.mileage ?? "",
    fuel_type: newVehicleData?.fuel_type ? newVehicleData.fuel_type.toLowerCase().charAt(0).toUpperCase() + newVehicleData.fuel_type.slice(1) : "",
    body_type: newVehicleData?.body_type ?? "",
    transmission: newVehicleData?.transmission ?? "",
    owners: newVehicleData?.owners ?? null,
    mot_due: newVehicleData?.mot_due ?? "",
    colour: newVehicleData?.colour ?? "",
    price: newVehicleData?.price ?? null,
    description: newVehicleData?.description ?? "",
    location: newVehicleData?.location ?? "",
    postcode: newVehicleData?.postcode ?? "",
    latitude: newVehicleData?.latitude ?? 0,
    longitude: newVehicleData?.longitude ?? 0,
    power: newVehicleData?.power ?? "",
    service_history: newVehicleData?.service_history ?? "",
    condition: newVehicleData?.condition ?? "",
    dealer_name: newVehicleData?.dealer_name ?? "",
    dealer_rating: newVehicleData?.dealer_rating ?? 0,
    review_count: newVehicleData?.review_count ?? 0,
    engine_size: newVehicleData?.engine_size ?? "",
    registration: newVehicleData?.registration ?? "",
    date_first_registered: newVehicleData?.date_first_registered ?? "",
    attention_grabber: newVehicleData?.attention_grabber ?? "",
    images: validImages
  };

  useEffect(() => {
    const fetchListingData = async () => {
      if (id) {
        try {
          const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
          const data = await response.json();
          
          setNewVehicleData(data);
          
          if (data.images) {
            const formattedImages: ImageData[] = data.images.map((img: any) => ({
              preview: img.url,
              url: img.url,
              id: img.id || `${Date.now()}-${Math.random()}`,
              caption: img.caption || '',
              is_primary: img.is_primary || false,
              colorSpace: 'srgb' as PredefinedColorSpace,
              data: new Uint8ClampedArray(),
              height: 0,
              width: 0
            }));
            setImages(formattedImages);
            
            const mainImageIdx = formattedImages.findIndex(img => img.is_primary);
            if (mainImageIdx !== -1) {
              setMainImageIndex(mainImageIdx);
            }
          }
        } catch (error) {
          console.error('Error fetching listing data:', error);
        }
      }
    };

    fetchListingData();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!vehicleData && !id) {
    return <Navigate to="/selling/find-car" replace />;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      addNewImages(Array.from(files));
    }
  };

  const addNewImages = async (newFiles: File[]) => {
    const validImageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    try {
      const processedImages = await Promise.all(
        validImageFiles.map(async (file) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result as string;
              resolve(base64String);
            };
            reader.readAsDataURL(file);
          });
  
          return {
            preview: base64,
            url: base64,
            id: `${file.name}-${Date.now()}`,
            caption: '',
            is_primary: false,
            colorSpace: 'srgb' as PredefinedColorSpace,
            data: new Uint8ClampedArray(),
            height: 0,
            width: 0
          };
        })
      );
  
      setImages(prev => [...prev, ...processedImages]);
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isDragging);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    addNewImages(files);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview || '');
      newImages.splice(index, 1);
      
      if (index === mainImageIndex) {
        setMainImageIndex(0);
      } else if (index < mainImageIndex) {
        setMainImageIndex(prev => prev - 1);
      }
      
      return newImages;
    });
  };

  React.useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);

  const handleOnSubmit = async (
    values: AdvertInitialValues,
    formikHelpers: FormikHelpers<AdvertInitialValues>) => {
  
    if (!user?.id) {
      console.error('User ID is missing');
      return;
    }
    
    const processedImages = images.map((image, index) => ({
      preview: image.preview,
      url: image.url,
      id: image.id,
      is_primary: index === mainImageIndex
    }));
  
    const validImages = processedImages.filter((img): img is ImageData => img !== null);
  
  const listingData = {
    user_id: user.id,
    id: id ? parseInt(id) : (values.id ?? 0),
    make: values.make ?? "",
    model: values.model ?? "",
    year: values.year ?? "",
    mileage: values.mileage ?? 0,
    fuel_type: values.fuel_type ? values.fuel_type.toLowerCase().charAt(0).toUpperCase() + values.fuel_type.slice(1) : "",
    body_type: values.body_type ?? "",
    transmission: values.transmission ?? "",
    owners: values.owners ?? 0,
    mot_due: values.mot_due ?? "",
    colour: values.colour ?? "",
    price: values.price ?? 0,
    description: values.description ?? "",
    location: values.location ?? "",
    postcode: values.postcode ?? "",
    latitude: values.latitude ?? 0,
    longitude: values.longitude ?? 0,
    power: values.power ?? "",
    service_history: values.service_history ?? "",
    condition: values.condition ?? "",
    dealer_name: values.dealer_name ?? "",
    dealer_rating: values.dealer_rating ?? 0,
    review_count: values.review_count ?? 0,
    engine_size: values.engine_size ?? "",
    registration: values.registration ?? "",
    date_first_registered: values.date_first_registered ?? "",
    attention_grabber: values.attention_grabber ?? "",
    images: validImages
  };

  console.log('User ID being sent:', user.id);


  console.log('Full user object:', user);
  console.log('Listing data user_id:', listingData.user_id);
  console.log('Sending data:', JSON.stringify(listingData, null, 2));
    
  try {
    if (id) {
      await dispatch(updateVehicleListing(listingData)).unwrap();
      formikHelpers.resetForm({ values });

      navigate(`/car-details/${id}`);
    } else {
      const result = await dispatch(createVehicleListing(listingData)).unwrap();
      navigate(`/car-details/${result.id}`);
    }
  } catch (error) {
    console.error('Failed to create/update listing:', error);
  }
};

  const serviceHistoryOptions = [
    { value: 'F', label: 'Full service history' },
    { value: 'P', label: 'Partial service history' },
    { value: 'N', label: 'No service' }
  ];

  return (
    <Formik
    enableReinitialize={ true }
    // validateOnMount={ !!user }
    initialValues={ initialValues }
    onSubmit={ handleOnSubmit }
    validationSchema={ advertSchema }
    validate={values => {
      console.log("Validating with schema:", advertSchema);
      console.log("Validation values:", values);
      try {
          advertSchema.validateSync(values);
          console.log("Validation passed!");
      } catch (err) {
          console.log("Validation failed:", err);
      }
      }}
    >
    { (formik) => {
    console.log("Current form values:", formik.values);

    return (
        // @ts-ignore
      <Form>
    <div className="max-w-4xl mx-auto bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate('/selling/find-car')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 pt-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>
      <div 
        className={`bg-gray-50 p-4 sm:p-8 rounded-lg text-center mb-6 transition-colors
          ${isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-500' : ''}`}
        onDragOver={(e) => handleDrag(e, true)}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        {images.length === 0 ? (
          <div className="text-center">
            <Camera className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50"
            >
              Add photos
            </button>
            <p className="mt-4 text-gray-600">
              <Info className="inline w-4 h-4 mr-1" />
              Buyers expect to see 20 images on an advert
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageGrid
              images={images}
              onReorder={setImages}
              onRemove={handleRemoveImage}
              mainImageIndex={mainImageIndex}
              onSetMainImage={setMainImageIndex}
            />
            <div className="text-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50"
              >
                Add more photos ({20 - images.length} remaining)
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{`${newVehicleData?.make} ${newVehicleData?.model} ${newVehicleData?.year}`}</h1>
          {/* <p className="text-gray-600">{newVehicleData?.variant}</p> */}
          {/* <button className="text-blue-600 hover:underline mt-2">Edit vehicle details</button> */}
        </div>
        
        <div className="mx-auto space-y-4 sm:space-y-6">
        {/* <button className="text-blue-600 hover:underline">Add attention grabber</button> */}
        <div className='flex flex-col space-y-2'>
            <Input
              label="Attention grabber"
              name="attention_grabber"
              value={ formik.values.attention_grabber }
              meta={ {
                  valid: !Boolean(formik.errors.attention_grabber),
                  error: formik.errors.attention_grabber,
                  touched: formik.touched.attention_grabber
              } }
              onChange={(e) => formik.handleChange(e) }
            /> 
        </div>
        <div className='flex flex-col space-y-2'>
            <Input
              label="Price"
              name="price"
              value={ formik.values.price }
              meta={ {
                  valid: !Boolean(formik.errors.price),
                  error: formik.errors.price,
                  touched: formik.touched.price
              } }
              onChange={(e) => formik.handleChange(e) }
            /> 
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Overview</h2>
          {/* <p>{vehicleData.owners} owners, MOT Due: {vehicleData.motDue}</p> */}
          {/* <button className="text-blue-600 hover:underline">Edit owners, service history, MOT and seats</button> */}
          <div className='flex flex-col space-y-2'>
            <Input
              label="Owners"
              name="owners"
              type="number"
              value={ formik.values.owners }
              meta={ {
                  valid: !Boolean(formik.errors.owners),
                  error: formik.errors.owners,
                  touched: formik.touched.owners
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Mileage"
              name="mileage"
              value={ formik.values.mileage }
              meta={ {
                  valid: !Boolean(formik.errors.mileage),
                  error: formik.errors.mileage,
                  touched: formik.touched.mileage
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Fuel type"
              name="fuel_type"
              value={ formik.values.fuel_type }
              meta={ {
                  valid: !Boolean(formik.errors.fuel_type),
                  error: formik.errors.fuel_type,
                  touched: formik.touched.fuel_type
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Body type"
              name="body_type"
              value={ formik.values.body_type }
              meta={ {
                  valid: !Boolean(formik.errors.body_type),
                  error: formik.errors.body_type,
                  touched: formik.touched.body_type
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <TextArea
              label="Description"
              description="Cars with a detailed description sell quicker"
              name="description"
              value={formik.values.description}
              onChange={(e) => formik.handleChange(e)}
              meta={{
                valid: !Boolean(formik.errors.description),
                error: formik.errors.description,
                touched: formik.touched.description
              }}
              className="p-3 sm:p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 sm:h-80 overscroll-none text-base sm:text-sm"
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="MOT due"
              name="mot_due"
              value={ formik.values.mot_due }
              meta={ {
                  valid: !Boolean(formik.errors.mot_due),
                  error: formik.errors.mot_due,
                  touched: formik.touched.mot_due
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Colour"
              name="colour"
              value={ formik.values.colour }
              meta={ {
                  valid: !Boolean(formik.errors.colour),
                  error: formik.errors.colour,
                  touched: formik.touched.colour
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Condition"
              name="condition"
              value={ formik.values.condition }
              meta={ {
                  valid: !Boolean(formik.errors.condition),
                  error: formik.errors.condition,
                  touched: formik.touched.condition
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Postcode"
              name="postcode"
              description="Your postcode will be hidden. We will only show your town"
              value={ formik.values.postcode }
              meta={ {
                  valid: !Boolean(formik.errors.postcode),
                  error: formik.errors.postcode,
                  touched: formik.touched.postcode
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Engine size"
              name="engine_size"
              value={ formik.values.engine_size }
              meta={ {
                  valid: !Boolean(formik.errors.engine_size),
                  error: formik.errors.engine_size,
                  touched: formik.touched.engine_size
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Input
              label="Power"
              name="power"
              value={ formik.values.power }
              meta={ {
                  valid: !Boolean(formik.errors.power),
                  error: formik.errors.power,
                  touched: formik.touched.power
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <Select
              label="Service history"
              name="service_history"
              options={serviceHistoryOptions}
              value={ formik.values.service_history }
              meta={ {
                  valid: !Boolean(formik.errors.service_history),
                  error: formik.errors.service_history,
                  touched: formik.touched.service_history
              } }
              onChange={(e) => formik.handleChange(e) }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* <div className="flex items-center gap-2">
              <span className="text-gray-600">Mileage</span>
              <div className="flex items-center gap-2">
                <span>{vehicleData.mileage} miles</span>
                <button className="text-blue-600 hover:underline">Edit mileage</button>
              </div>
            </div> */}
            {/* {[
              { label: 'Fuel type', value: vehicleData.fuelType },
              { label: 'Body type', value: vehicleData.bodyType },
              // { label: 'Gearbox', value: vehicleData.gearbox },
              { label: 'Owners', value: vehicleData.owners }
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))} */}
          </div>
        </div>
        {/* <div className="space-y-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-gray-600">You have not added a description yet. Cars with a detailed description sell quicker</p>
          <button className="text-blue-600 hover:underline">Add description</button>
        </div> */}
        {[
          { icon: Star, title: 'Vehicle features', chevron: true },
          { icon: Calculator, title: 'Running costs', chevron: true },
          // { icon: FileText, title: 'Basic history check', subtitle: `${vehicleData.basicChecks} checks passed`, chevron: true },
          { icon: Video, title: 'Advert video - add a video', chevron: true }
        ].map((section, index) => (
          <button
            key={index}
            onClick={(e) => e.preventDefault()}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b"
          >
            <div className="flex items-center gap-3">
              <section.icon className="w-6 h-6 text-gray-600" />
              <div className="text-left">
                <div className="font-medium">{section.title}</div>
                {/* {section.subtitle && <div className="text-sm text-gray-600">{section.subtitle}</div>} */}
              </div>
            </div>
            {section.chevron && <ChevronRight className="w-5 h-5 text-gray-400" />}
          </button>
        ))}
        <button type='submit' className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-md hover:bg-blue-700 mt-6 text-sm sm:text-base touch-manipulation min-h-[48px] sm:min-h-[auto]">
          I'm happy with my ad
        </button>
        </div>
        <div className="flex justify-center py-8">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronUp className="w-5 h-5" />
            Back to top
          </button>
        </div>
      </div>
    </div>
    </Form>
    )}}
    </Formik>
  );
};

export default Advert;