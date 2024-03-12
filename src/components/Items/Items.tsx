
import React, { useEffect, useRef, useState } from 'react';
import data from '../../server.json'; // change this to backend Api
import './index.css';
import { useParams } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  items: MenuItem[];
}

interface MenuItem {
  name: string;
  description: string;
}

interface Menu {
  id: number;
  name: string;
  slogan: string;
  categories: Category[];
}

const ItemsComponent: React.FC = () => {
  const menuImageRef = useRef<HTMLImageElement>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number>();
  const [menuItemsHeight, setMenuItemsHeight] = useState<number>();
  const [menuSingleItemHeight, setMenuSingleItemHeight] = useState<number>();
  const [numberOfPages, setNumberOfPages] = useState<number>();
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState<number>(0);
  const [menu, setMenu] = useState<Menu>(data.menu);
  const { categoryId } = useParams<{ categoryId: string }>();
  const [Items, setItems] = useState<MenuItem[]>([])
  
  useEffect(() => {
    if (categoryId && menu && menu.categories) {
      const category = menu.categories.find(category => category.id === parseInt(categoryId));
      if (category) {
        setItems([...category.items]);
      }
    }
  }, [categoryId])

  useEffect(() => {
    if (menuImageRef.current) {
      const handleImageLoad = () => {
        const imageHeightDOM = menuImageRef.current?.clientHeight;
        setImageHeight(imageHeightDOM);
      };

      menuImageRef.current.addEventListener('load', handleImageLoad);

      return () => {
        if (menuImageRef.current) {
          menuImageRef.current.removeEventListener('load', handleImageLoad);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (Items && menuItemRef.current) {
      const menuItemHeight = menuItemRef.current.clientHeight;
      setMenuItemsHeight((((menuItemHeight as number + 10) * Items.length) + 200));
      setMenuSingleItemHeight(menuItemHeight as number + 10 + 200 / Items.length);
      console.log('Menu items height:', menuItemHeight);
    }
  }, [Items]);

  useEffect(() => {
    if (Math.ceil((menuItemsHeight as number) / (imageHeight as number)))
      setNumberOfPages(Math.ceil((menuItemsHeight as number) / (imageHeight as number)))
    if (menuSingleItemHeight)
      setNumberOfItemsPerPage(Math.floor((imageHeight as number) / (menuSingleItemHeight as number)))
  }, [imageHeight, menuItemsHeight, menuSingleItemHeight])

  console.log((imageHeight as number), menuItemsHeight, menuSingleItemHeight, numberOfItemsPerPage, (menuItemsHeight as number) / (imageHeight as number), numberOfPages)

  console.log(Items)
  return (
    <div className="menu-page-pdf">
      {[...Array(numberOfPages)].map((_, pageIndex) => {
        const startIndex = pageIndex * numberOfItemsPerPage;
        const endIndex = Math.min(startIndex + numberOfItemsPerPage, Items.length);
        const categoryItems = Items.slice(startIndex, endIndex);

        return <div key={pageIndex} className="menu-page-content">
          <div className="background-image" >
            <img ref={menuImageRef} src="../assets/images/demoPhoto.jpeg" alt="" />
          </div>
          <div className="menu-items">
            {categoryItems.length ? <div className="items-content">
              {categoryItems?.map((item, itemIndex) => {
                return <div key={itemIndex} className="menu-item" ref={menuItemRef}>
                  <div className="menu-category-name">{item.name}</div>
                  <div className="menu-category-name">{item.description}</div>
                </div>
              })}
            </div>
              :
              <div className="items-content">
                {Items?.map((item, itemIndex) => {
                  return <div key={itemIndex} className="menu-item" ref={menuItemRef}>
                    <div className="menu-category-name">{item.name}</div>
                    <div className="menu-category-name">{item.description}</div>
                  </div>
                })}
              </div>}
          </div>
        </div>
      })}
    </div>
  );
};

export default ItemsComponent;