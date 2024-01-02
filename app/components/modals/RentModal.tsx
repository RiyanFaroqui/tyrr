'use client';

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false);

    const {register, handleSubmit, setValue, watch,
    formState: {errors,}, reset,
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            storageCount: 0,
            doorCount: 1,
            seatCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        }
    });

    const category = watch('category');
    const location = watch('location');
    const seatCount = watch('seatCount');
    const doorCount = watch('doorCount');
    const storageCount = watch('storageCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('/api/listings', data)
        .then(() => {
            toast.success("Your listing was created!");
            router.refresh();
            reset();
            setStep(STEPS.CATEGORY);
            rentModal.onClose();
        })
        .catch(() => {
            toast.error('Something went wrong')
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const actionLabel = useMemo (() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo (() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Which of these best describes your car?"
                subtitle="Pick a category"
            />
            <div className="grid grid-cols-1 md: grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1">
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                title="Where is your car located?"
                subtitle="Help guests find your car!"
                />
                <CountrySelect 
                value={location}
                onChange={(value) => setCustomValue('location', value)}
                />
                <Map 
                center={location?.latlng}
                />
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Share some basics about your car"
              subtitle="What does your car have?"
            />
            <Counter 
              onChange={(value) => setCustomValue('seatCount', value)}
              value={seatCount}
              title="Passengers" 
              subtitle="How many seats does your car have?"
            />
            <hr />
            <Counter 
              onChange={(value) => setCustomValue('doorCount', value)}
              value={doorCount}
              title="Doors" 
              subtitle="How many doors does your car have?"
            />
            <hr />
            <Counter 
              onChange={(value) => setCustomValue('storageCount', value)}
              value={storageCount}
              title="Storage" 
              subtitle="How many carry-on bags does your car fit?"
            />
          </div>
        )
      }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="Add a photo of your car"
                subtitle="Show potential guests what your car looks like!"
                />
                <ImageUpload 
                value={imageSrc}
                onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="How would you describe your car?"
                subtitle="Keep it short and sweet!"
                />
                <Input 
                id="title" label="Title" disabled={isLoading} register={register} errors={errors} required
                />
                <hr />
                <Input 
                id="description" label="Description" disabled={isLoading} register={register} errors={errors} required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                title="Now, set your price"
                subtitle="How much do you charge per day?"
                />
                <Input 
                id="price" label="Price" formatPrice disabled={isLoading} register={register} 
                errors={errors} required
                />
            </div>
        )
    }

    return ( 
        <Modal
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        title="Host your car on Tyrr!"
        body={bodyContent}
        />
    );
}

export default RentModal;