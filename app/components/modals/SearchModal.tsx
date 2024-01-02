'use client';

import { formatISO } from "date-fns";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";

import Modal from "./Modal";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

import useSearchModal from "@/app/hooks/useSearchModal";

enum STEPS {LOCATION = 0, DATE = 1, INFO = 2}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>()
    const [step, setStep] = useState(STEPS.LOCATION);
    const [doorCount, setDoorCount] = useState(1);
    const [seatCount, setSeatCount] = useState(1);
    const [storageCount, setStorageCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(), endDate: new Date(), key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
          }
      
          let currentQuery = {};
      
          if (params) {
            currentQuery = qs.parse(params.toString())
          }

          const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            doorCount,
            seatCount,
            storageCount
          };

          if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
          }
      
          if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
          }
      
          const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery,
          }, { skipNull: true });
      
          setStep(STEPS.LOCATION);
          searchModal.onClose();

          router.push(url);
        }, 
    [step, searchModal, location, router, doorCount, seatCount, storageCount, dateRange, onNext, params]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
          return 'Search'
        }
        return 'Next'
      }, [step]);
    
      const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
          return undefined
        }
        return 'Back'
      }, [step]);

      let bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="Where do you wanna drive?"
            subtitle="Find the perfect location!"
          />
          <CountrySelect 
            value={location} 
            onChange={(value) => setLocation(value as CountrySelectValue)} 
          />
          <hr />
          <Map center={location?.latlng} />
        </div>
      )

      if (step === STEPS.DATE) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="When do you plan on going?"
              subtitle="Make sure everyone is available!"
            />
            <Calendar
              onChange={(value) => setDateRange(value.selection)}
              value={dateRange}
            />
          </div>
        )
      }

      if (step === STEPS.INFO) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Additional requirements"
              subtitle="Find your ideal car!"
            />
            <Counter 
              onChange={(value) => setSeatCount(value)}
              value={seatCount}
              title="Passengers" 
              subtitle="How many passengers are coming?"
            />
            <hr />
            <Counter 
              onChange={(value) => setDoorCount(value)}
              value={doorCount}
              title="Doors" 
              subtitle="How many doors do you need on the car?"
            />        
            <hr />
            <Counter 
              onChange={(value) => {setStorageCount(value)}}
              value={storageCount}
              title="Storage"
              subtitle="How many carry-on bags are you bringing?"
            />
          </div>
        )
      }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            title="Filters"
            actionLabel={actionLabel}
            onSubmit={onSubmit}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            onClose={searchModal.onClose}
            body={bodyContent}
        />
    );
}

export default SearchModal;