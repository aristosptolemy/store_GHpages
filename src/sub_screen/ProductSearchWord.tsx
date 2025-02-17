import React, { useState, ChangeEvent, useEffect } from 'react';
import '../css/ProductSearchWord.css';
import { searchStr } from '../backend/WebStorage';
import { InventorySearch, ImageUrlSet } from '../backend/Server_end';

import DetailDialog from './ProductdetailDialog';


interface SearchProps {
  setsearchData: (data: any) => void;
  setDetailisDialogOpen: (result: boolean) => void;
  setDetailIMAGE: (imageresult: string) => void;
  setisLoading: (loading: boolean) => void;
  setsearchtabledata: (tabledata:any) => void;
  searchtabledata: any;
  setsearchDataIndex: (numberdata: number) => void;
  searchDataIndex: number,
  insert: (data: any) => void;
  onConfirm: () => void;
  isOpen: boolean;
  addButtonName: string;
}

export default function WordSearch({ setsearchData, setDetailisDialogOpen, setDetailIMAGE, setisLoading, setsearchtabledata, searchtabledata, setsearchDataIndex, insert, isOpen, addButtonName, onConfirm }: SearchProps) {
  const [SWord, setSWord] = useState<string>('');
  const [searchData, setsearchdata] = useState<any>([]);
  const [Index, setIndex] = useState(0);



  // テキスト入力が変更されたときに実行される関数
  const handlewordchange = (event: ChangeEvent<HTMLInputElement>) => {
    setSWord(event.target.value); // 入力された値をSWordにセット
  };

  // 商品の再検索を行い、結果を状態に保存
  const productReSearch = async () => {
    const result = await searchStr(SWord);
    setsearchdata(result);
    setsearchtabledata(result);
  };


  const handleOpenDetailDialog = async (index: any) => {
    setIndex(index)
    setsearchDataIndex(index);//ここでエラー
    setisLoading(true);
    var match = 'https://lh3.googleusercontent.com/d/1RNZ4G8tfPg7dyKvGABKBM88-tKIEFhbm';// 画像がないとき用のURL
    const image = await InventorySearch(searchtabledata[index][1],"商品コード","商品画像");// 商品画像検索
    if (image[2] !== ''){// 商品画像のURLがあればそのURLを上書き
      match = ImageUrlSet(image[2]);
    }
    await setDetailIMAGE(match);//画像をセット
    await setsearchData(searchtabledata[index]);
    await setDetailisDialogOpen(true);
    setisLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key == 'Enter'){
      productReSearch();
    }
  };





  return (
    <div className="WordSearch-area">
      <div className="search-input">
        <input
          type="text"
          value={SWord}
          pattern="^[ぁ-ん]+$"
          onChange={handlewordchange}
          placeholder="検索ワードを入力"
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <a className="buttonUnderlineSe" onClick={productReSearch}>
          検索
        </a>
      </div>
      <div className="search-head">
        <table className="search-head">
          <thead>
            <tr>
              <th className="stcode">商品ナンバー</th>
              <th className="stname">商品名</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="search-table">
        <div className="scrollable-table">
          <table className="search-data-table">
            <tbody className="datail">
              {searchtabledata.map((row, index) => (
                <tr key={index}>
                  <td className="scode">
                    <a
                      className="buttonUnderlineDR"
                      role="button"
                      href="#"
                      onClick={() => insert(row)}
                    >
                      {row[1]}
                    </a>
                  </td>
                  <td className="sname">
                    <a
                      className="buttonUnderlineD"
                      role="button"
                      href="#"
                      onClick={() => handleOpenDetailDialog(index)}
                    >
                      {row[2]}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DetailDialog
          onConfirm={onConfirm}
          isOpen={isOpen}
          insert={insert}
          searchtabledata={searchData}
          searchDataIndex={Index}
          addButtonName={addButtonName}
        />
      </div>
    </div>
  );
}