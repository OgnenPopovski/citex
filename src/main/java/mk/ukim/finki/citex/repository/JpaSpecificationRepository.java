/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mk.ukim.finki.citex.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 *
 * @author Ognen
 */
public interface JpaSpecificationRepository<T> extends JpaRepository<T, Integer>, JpaSpecificationExecutor<T> {

}
